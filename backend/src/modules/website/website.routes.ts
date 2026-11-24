import { Router } from 'express';
import { getWebsiteSettings, updateWebsiteSettings } from './website.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

// Public can read website settings & navigation toggles
router.get('/settings', getWebsiteSettings);

// Teachers & Admins can enable/disable pages and update settings
router.patch('/settings', authenticate, requireRole(['ADMIN', 'TEACHER']), updateWebsiteSettings);

export default router;
