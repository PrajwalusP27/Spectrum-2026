import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Registration from '../models/Registration.js';
import { authCookieOptions, clearAuthCookieOptions } from '../middleware/authMiddleware.js';

export async function login(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase(); const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const admin = await Admin.findOne({ email });
    const matches = admin ? await bcrypt.compare(password, admin.passwordHash) : await bcrypt.compare(password, '$2a$10$7EqJtq98hPqEX7fNZaFWoO5u4TgWbEwH0s0o9T4XgI8.SZ9E2dq6W').catch(() => false);
    if (!admin || !matches) return res.status(401).json({ message: 'Invalid email or password.' });
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured.');
    const token = jwt.sign({}, process.env.JWT_SECRET, { subject: admin.id, issuer: 'spectrum-2026', expiresIn: '8h' });
    return res.cookie('spectrum_admin', token, authCookieOptions()).json({ message: 'Signed in.' });
  } catch (error) { return next(error); }
}

export function logout(req, res) { res.clearCookie('spectrum_admin', clearAuthCookieOptions()); return res.json({ message: 'Signed out.' }); }
export function me(req, res) { return res.json({ authenticated: true }); }

const sports = ['Volleyball', 'Throwball', 'Carrom'];
export async function dashboardStats(req, res, next) {
  try {
    const [totalRegistrations, participatingColleges, grouped] = await Promise.all([
      Registration.countDocuments(),
      Registration.distinct('collegeNameNormalized').then((values) => values.length),
      Registration.aggregate([{ $group: { _id: '$sport', count: { $sum: 1 } } }])
    ]);
    const bySport = Object.fromEntries(sports.map((sport) => [sport, 0]));
    for (const item of grouped) if (sports.includes(item._id)) bySport[item._id] = item.count;
    return res.json({ totalRegistrations, participatingColleges, bySport });
  } catch (error) { return next(error); }
}

function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
export async function listRegistrations(req, res, next) {
  try {
    const page = Math.max(1, Math.min(100000, Number.parseInt(req.query.page, 10) || 1));
    const limit = Math.max(1, Math.min(100, Number.parseInt(req.query.limit, 10) || 10));
    const filter = {};
    if (req.query.sport && sports.includes(req.query.sport)) filter.sport = req.query.sport;
    if (req.query.college) filter.collegeNameNormalized = String(req.query.college).trim().toLocaleLowerCase('en-IN');
    if (req.query.search) {
      const pattern = new RegExp(escapeRegex(String(req.query.search).trim().slice(0, 100)), 'i');
      filter.$or = [{ registrationId: pattern }, { collegeName: pattern }, { teamName: pattern }];
    }
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    const [total, registrations, collegeValues] = await Promise.all([
      Registration.countDocuments(filter),
      Registration.find(filter).select('registrationId collegeName teamName sport representativeName teamMembers createdAt').sort({ createdAt: sortDirection }).skip((page - 1) * limit).limit(limit).lean(),
      Registration.distinct('collegeName')
    ]);
    const colleges = [...new Set(collegeValues)].sort((a, b) => a.localeCompare(b));
    return res.json({ registrations, pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) }, colleges });
  } catch (error) { return next(error); }
}

export async function getRegistrationDetails(req, res, next) {
  try {
    const registration = await Registration.findById(req.params.id).lean();
    if (!registration) return res.status(404).json({ message: 'Registration not found.' });
    return res.json(registration);
  } catch (error) { return next(error); }
}

function csvCell(value) { let text = String(value ?? ''); if (/^[\s\u0000-\u001f]*[=+@-]/.test(text)) text = `'${text}`; return `"${text.replaceAll('"', '""')}"`; }
export async function exportRegistrations(req, res, next) {
  try {
    const filter = {};
    if (req.query.sport && sports.includes(req.query.sport)) filter.sport = req.query.sport;
    if (req.query.college) filter.collegeNameNormalized = String(req.query.college).trim().toLocaleLowerCase('en-IN');
    if (req.query.search) { const pattern = new RegExp(escapeRegex(String(req.query.search).trim().slice(0, 100)), 'i'); filter.$or = [{ registrationId: pattern }, { collegeName: pattern }, { teamName: pattern }]; }
    const records = await Registration.find(filter).sort({ createdAt: req.query.sort === 'asc' ? 1 : -1 }).lean();
    const header = ['Registration ID', 'College Name', 'Team Name', 'Sport', 'Representative Name', 'Contact Number', 'Team Members', 'Registration Date'];
    const lines = [header, ...records.map((row) => [row.registrationId, row.collegeName, row.teamName, row.sport, row.representativeName, row.contactNumber, row.teamMembers.join('; '), row.createdAt.toISOString()])].map((line) => line.map(csvCell).join(','));
    res.set({ 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="spectrum-registrations.csv"', 'Cache-Control': 'no-store' });
    return res.send(`\uFEFF${lines.join('\r\n')}`);
  } catch (error) { return next(error); }
}
