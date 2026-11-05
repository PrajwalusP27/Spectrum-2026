import { Router } from 'express';
import { createRegistration, getPublicRegistration } from '../controllers/registrationController.js';
import { registrationRules, registrationIdRule } from '../validators/registrationValidators.js';
import { validateRequest } from '../middleware/validationMiddleware.js';

const router = Router();
router.post('/', registrationRules, validateRequest, createRegistration);
router.get('/:registrationId', registrationIdRule, validateRequest, getPublicRegistration);
export default router;
