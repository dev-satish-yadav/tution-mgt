import { Router } from 'express';
import {
  getStandards,
  getStandardById,
  createStandard,
  updateStandard,
  deleteStandard,
} from './standard.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

// Public & authenticated listing (Visitors, Teachers, Students can view available streams/standards)
router.get('/', getStandards);
router.get('/:id', getStandardById);

// Admin-only management
router.post('/', authenticate, requireRole(['ADMIN']), createStandard);
router.patch('/:id', authenticate, requireRole(['ADMIN']), updateStandard);
router.delete('/:id', authenticate, requireRole(['ADMIN']), deleteStandard);

export default router;
