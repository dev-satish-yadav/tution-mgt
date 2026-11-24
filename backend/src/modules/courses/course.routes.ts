import { Router } from 'express';
import { getCourses, getCourseBySlug, createCourse, updateCourse } from './course.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

// Public routes for visitors & landing page
router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);

// Admin-protected routes
router.post('/', authenticate, requireRole(['ADMIN']), createCourse);
router.patch('/:id', authenticate, requireRole(['ADMIN']), updateCourse);

export default router;
