import { Router } from 'express';
import {
  getTests,
  getTestById,
  createTest,
  submitTestAttempt,
  getMyAttempts,
  getAttemptsForTest,
} from './test.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

// View list of tests
router.get('/', getTests);

// Student gets their past test attempts
router.get('/my-attempts', requireRole(['STUDENT']), getMyAttempts);

// Get specific test questions / details
router.get('/:id', getTestById);

// Admin & Teacher create test
router.post('/', requireRole(['ADMIN', 'TEACHER']), createTest);

// Student submits test attempt
router.post('/:id/attempt', requireRole(['STUDENT']), submitTestAttempt);

// Teacher & Admin view results for a test
router.get('/:testId/attempts', requireRole(['ADMIN', 'TEACHER']), getAttemptsForTest);

export default router;
