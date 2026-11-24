import { Router } from 'express';
import {
  getHomeworkList,
  createHomework,
  submitHomework,
  getSubmissionsForHomework,
  evaluateSubmission,
  getMySubmissions,
} from './homework.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

// View list of homework
router.get('/', getHomeworkList);

// Student views their own submissions
router.get('/my-submissions', requireRole(['STUDENT']), getMySubmissions);

// Admin & Teacher create homework
router.post('/', requireRole(['ADMIN', 'TEACHER']), createHomework);

// Student submits homework
router.post('/submit', requireRole(['STUDENT']), submitHomework);

// Admin & Teacher view submissions for a homework assignment
router.get('/:homeworkId/submissions', requireRole(['ADMIN', 'TEACHER']), getSubmissionsForHomework);

// Admin & Teacher grade/evaluate submission
router.patch('/submissions/:submissionId/evaluate', requireRole(['ADMIN', 'TEACHER']), evaluateSubmission);

export default router;
