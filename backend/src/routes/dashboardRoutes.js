import { Router } from 'express';
import { dashboardStats } from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/stats', requireAdmin, dashboardStats);
export default router;
