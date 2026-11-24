import { Router } from 'express';
import { getBatchTimetable, saveBatchTimetable } from './timetable.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/:batchId', getBatchTimetable);
router.post('/', requireRole(['ADMIN']), saveBatchTimetable);

export default router;
