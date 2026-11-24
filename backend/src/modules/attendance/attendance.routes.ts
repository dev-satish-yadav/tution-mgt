import { Router } from 'express';
import { markAttendance, getAttendance, getStudentAttendanceSummary } from './attendance.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

// Student views own attendance summary
router.get('/my-summary', requireRole(['STUDENT']), getStudentAttendanceSummary);

// Admin & Teacher get batch attendance
router.get('/', requireRole(['ADMIN', 'TEACHER']), getAttendance);

// Admin & Teacher mark attendance
router.post('/', requireRole(['ADMIN', 'TEACHER']), markAttendance);

export default router;
