import { Router } from 'express';
import { getBatches, getBatchById, createBatch, updateBatch, deleteBatch } from './batch.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

// Admin and Teachers can view batches
router.get('/', requireRole(['ADMIN', 'TEACHER']), getBatches);
router.get('/:id', requireRole(['ADMIN', 'TEACHER', 'STUDENT']), getBatchById);

// Admin can create, update, and delete batches
router.post('/', requireRole(['ADMIN']), createBatch);
router.patch('/:id', requireRole(['ADMIN']), updateBatch);
router.delete('/:id', requireRole(['ADMIN']), deleteBatch);

export default router;
