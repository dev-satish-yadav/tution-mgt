import { Router } from 'express';
import { getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject } from './subject.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

// Read subjects: Visitors, Teachers, Students, Admin
router.get('/', getSubjects);
router.get('/:id', getSubjectById);

// Admin can manage subjects (Create, Edit, Delete)
router.post('/', authenticate, requireRole(['ADMIN']), createSubject);
router.patch('/:id', authenticate, requireRole(['ADMIN']), updateSubject);
router.delete('/:id', authenticate, requireRole(['ADMIN']), deleteSubject);

export default router;
