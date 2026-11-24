import { Router } from 'express';
import { getAdminDashboard, getTeacherDashboard, getStudentDashboard } from './dashboard.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/admin', requireRole(['ADMIN']), getAdminDashboard);
router.get('/teacher', requireRole(['TEACHER']), getTeacherDashboard);
router.get('/student', requireRole(['STUDENT']), getStudentDashboard);

export default router;
