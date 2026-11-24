import { Router } from 'express';
import { createTeacher, getTeachers, getTeacherById, assignTeacher, getMyAssignments } from './teacher.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

// Publicly list active teachers (for About Us page & website)
router.get('/public', getTeachers);

router.use(authenticate);

// List teachers: Admin and Teacher
router.get('/', requireRole(['ADMIN', 'TEACHER']), getTeachers);

// Teacher gets own assignments
router.get('/my-assignments', requireRole(['TEACHER']), getMyAssignments);

// Admin creates teacher
router.post('/', requireRole(['ADMIN']), createTeacher);

// Admin assigns teacher to batch & subject
router.post('/assign', requireRole(['ADMIN']), assignTeacher);

// Get specific teacher
router.get('/:id', requireRole(['ADMIN', 'TEACHER']), getTeacherById);

export default router;
