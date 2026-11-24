import { Router } from 'express';
import { getMaterials, createMaterial, deleteMaterial } from './material.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getMaterials);
router.post('/', requireRole(['ADMIN', 'TEACHER']), createMaterial);
router.delete('/:id', requireRole(['ADMIN', 'TEACHER']), deleteMaterial);

export default router;
