export function notFound(req, res) { res.status(404).json({ message: 'The requested endpoint was not found.' }); }

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.too.large') return res.status(413).json({ message: 'Request body is too large.' });
  if (error.name === 'ValidationError') {
    const errors = Object.fromEntries(Object.entries(error.errors).map(([key, value]) => [key, value.message]));
    return res.status(400).json({ message: 'Please correct the registration details.', errors });
  }
  if (error.code === 11000) return res.status(409).json({ message: 'A registration ID conflict occurred. Please submit again.' });
  console.error(error);
  return res.status(500).json({ message: 'An unexpected server error occurred.' });
}
