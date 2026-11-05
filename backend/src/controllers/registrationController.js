import { randomBytes } from 'node:crypto';
import Registration from '../models/Registration.js';

export async function createRegistration(req, res, next) {
  try {
    const { sport, collegeName, teamName, representativeName, contactNumber, teamMembers } = req.body;
    let registrationId;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      registrationId = `SP26-${randomBytes(5).toString('hex').toUpperCase()}`;
      if (!await Registration.exists({ registrationId })) break;
      registrationId = undefined;
    }
    if (!registrationId) return res.status(503).json({ message: 'Unable to create a unique registration ID. Please try again.' });
    const registration = await Registration.create({ registrationId, sport, collegeName: collegeName.trim(), collegeNameNormalized: collegeName.trim().toLocaleLowerCase('en-IN'), sportNormalized: sport.toLocaleLowerCase('en-IN'), teamName: teamName.trim(), representativeName: representativeName.trim(), contactNumber: contactNumber.trim(), teamMembers });
    return res.status(201).json({ registrationId: registration.registrationId, collegeName: registration.collegeName, teamName: registration.teamName, sport: registration.sport, message: 'Your registration application has been received.' });
  } catch (error) { return next(error); }
}

export async function getPublicRegistration(req, res, next) {
  try {
    const registration = await Registration.findOne({ registrationId: req.params.registrationId }).select('registrationId collegeName teamName sport createdAt').lean();
    if (!registration) return res.status(404).json({ message: 'Registration not found.' });
    return res.json(registration);
  } catch (error) { return next(error); }
}
