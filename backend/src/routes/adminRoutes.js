import { Router } from 'express';
import { body, param } from 'express-validator';
import { login, logout, me, getRegistrationDetails, listRegistrations, exportRegistrations } from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';

const router = Router();
router.post('/login', [body('email').isEmail().withMessage('Enter a valid email address.'), body('password').isString().isLength({ min: 1, max: 200 }).withMessage('Password is required.'), validateRequest], login);
router.post('/logout', logout);
router.get('/me', requireAdmin, me);
router.get('/registrations/export', requireAdmin, exportRegistrations);
router.get('/registrations', requireAdmin, listRegistrations);
router.get('/registrations/:id', requireAdmin, [param('id').isMongoId().withMessage('Invalid registration reference.'), validateRequest], getRegistrationDetails);
export default router;
