import jwt from 'jsonwebtoken';

export function requireAdmin(req, res, next) {
  const token = req.cookies?.spectrum_admin;
  if (!token) return res.status(401).json({ message: 'Authentication required.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'spectrum-2026' });
    req.adminId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  }
}

export function authCookieOptions() {
  const crossSite = process.env.COOKIE_SAME_SITE === 'none' || process.env.NODE_ENV === 'production';
  return { httpOnly: true, secure: crossSite, sameSite: crossSite ? 'none' : 'lax', path: '/', maxAge: 8 * 60 * 60 * 1000, ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}) };
}

export function clearAuthCookieOptions() { const { maxAge, ...options } = authCookieOptions(); return options; }
