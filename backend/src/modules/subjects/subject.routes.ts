import { Router } from 'express';
import { getSubjects, createSubject, updateSubject, addChapter } from './subject.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

// Public can read subjects for website course syllabus
router.get('/', getSubjects);

// Admin can manage subjects
router.post('/', authenticate, requireRole(['ADMIN']), createSubject);
router.patch('/:id', authenticate, requireRole(['ADMIN']), updateSubject);
router.post('/:id/chapters', authenticate, requireRole(['ADMIN']), addChapter);

export default router;
