import { validationResult } from 'express-validator';

export function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = {};
  for (const item of result.array()) if (!errors[item.path]) errors[item.path] = item.msg;
  return res.status(400).json({ message: 'Please correct the highlighted fields.', errors });
}
