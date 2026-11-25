import { Router } from 'express';
import { createStudent, getStudents, getStudentById, updateStudent } from './student.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

// Student listing: Admin and Teachers can view
router.get('/', requireRole(['ADMIN', 'TEACHER']), getStudents);

// Student creation: Admin and Teachers can create student accounts
router.post('/', requireRole(['ADMIN', 'TEACHER']), createStudent);

// Student detail: Admin, Teacher, or Student (own profile)
router.get('/:id', requireRole(['ADMIN', 'TEACHER', 'STUDENT']), getStudentById);

// Student update: Admin and Teachers can update student details
router.patch('/:id', requireRole(['ADMIN', 'TEACHER']), updateStudent);

export default router;
