import { Router } from 'express';
import { getBatches, getBatchById, createBatch, updateBatch } from './batch.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

// Admin and Teachers can view batches
router.get('/', requireRole(['ADMIN', 'TEACHER']), getBatches);
router.get('/:id', requireRole(['ADMIN', 'TEACHER', 'STUDENT']), getBatchById);

// Admin can create and update batches
router.post('/', requireRole(['ADMIN']), createBatch);
router.patch('/:id', requireRole(['ADMIN']), updateBatch);

export default router;
