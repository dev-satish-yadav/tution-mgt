import { Router } from 'express';
import { enrollStudent, getEnrollments } from './enrollment.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', requireRole(['ADMIN', 'TEACHER']), getEnrollments);
router.post('/', requireRole(['ADMIN']), enrollStudent);

export default router;
