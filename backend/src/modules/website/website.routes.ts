import { Router } from 'express';
import { getWebsiteSettings, updateWebsiteSettings } from './website.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

// Public can read website settings & navigation toggles
router.get('/settings', getWebsiteSettings);

// Only Super Admin can enable/disable pages and update website settings
router.patch('/settings', authenticate, requireRole(['ADMIN']), updateWebsiteSettings);

export default router;
