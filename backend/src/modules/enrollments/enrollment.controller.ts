import { Request, Response, NextFunction } from 'express';
import { Enrollment } from './enrollment.model.js';
import { Batch } from '../batches/batch.model.js';
import { StudentProfile } from '../students/student.model.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AppError } from '../../common/errors/app.error.js';

export const enrollStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId, batchId, notes } = req.body;

    // Check if batch exists
    const batch = await Batch.findById(batchId);
    if (!batch) throw AppError.notFound('Batch not found');

    const existing = await Enrollment.findOne({ student: studentId, batch: batchId });
    if (existing) throw AppError.conflict('Student is already enrolled in this batch');

    const enrollment = await Enrollment.create({
      student: studentId,
      batch: batchId,
      status: 'ACTIVE',
      notes,
    });

    // Update batch counter & student profile batch
    await Batch.findByIdAndUpdate(batchId, { $inc: { currentEnrollment: 1 } });
    await StudentProfile.findOneAndUpdate({ user: studentId }, { batch: batchId });

    return sendSuccess(res, enrollment, 'Student enrolled successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getEnrollments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.batchId) filter.batch = req.query.batchId;
    if (req.query.studentId) filter.student = req.query.studentId;

    const enrollments = await Enrollment.find(filter)
      .populate('student', 'name email phone')
      .populate('batch', 'name code grade scheduleTime');

    return sendSuccess(res, enrollments, 'Enrollments retrieved');
  } catch (error) {
    next(error);
  }
};
