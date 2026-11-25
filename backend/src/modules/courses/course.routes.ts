import { Router } from 'express';
import { getCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse } from './course.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

// Public routes for visitors & landing page (and accessible to teachers/students)
router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);

// Admin-protected routes (Super Admin can create, edit, delete)
router.post('/', authenticate, requireRole(['ADMIN']), createCourse);
router.patch('/:id', authenticate, requireRole(['ADMIN']), updateCourse);
router.delete('/:id', authenticate, requireRole(['ADMIN']), deleteCourse);

export default router;
