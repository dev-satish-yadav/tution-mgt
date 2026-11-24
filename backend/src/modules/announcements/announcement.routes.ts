import { Router } from 'express';
import { getAnnouncements, createAnnouncement } from './announcement.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getAnnouncements);
router.post('/', requireRole(['ADMIN', 'TEACHER']), createAnnouncement);

export default router;
