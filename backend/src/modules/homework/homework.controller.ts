import { Response, NextFunction } from 'express';
import { Homework } from './homework.model.js';
import { Submission } from './submission.model.js';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AppError } from '../../common/errors/app.error.js';

export const getHomeworkList = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.grade) filter.grade = req.query.grade;
    if (req.query.batchId) filter.batch = req.query.batchId;
    if (req.query.subjectId) filter.subject = req.query.subjectId;

    const list = await Homework.find(filter)
      .populate('subject', 'name code')
      .populate('batch', 'name code')
      .populate('assignedBy', 'name')
      .sort({ dueDate: -1 });

    return sendSuccess(res, list, 'Homework list retrieved');
  } catch (error) {
    next(error);
  }
};

export const createHomework = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, grade, subjectId, batchId, dueDate, totalMarks, attachmentUrl, attachmentName } = req.body;

    const homework = await Homework.create({
      title,
      description,
      grade,
      subject: subjectId,
      batch: batchId,
      assignedBy: req.user!.userId,
      dueDate,
      totalMarks: totalMarks || 20,
      attachmentUrl,
      attachmentName,
    });

    return sendSuccess(res, homework, 'Homework assigned successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const submitHomework = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { homeworkId, fileUrl, fileName } = req.body;

    const homework = await Homework.findById(homeworkId);
    if (!homework) throw AppError.notFound('Homework not found');

    const isLate = new Date() > new Date(homework.dueDate);

    const submission = await Submission.findOneAndUpdate(
      { homework: homeworkId, student: req.user!.userId },
      {
        homework: homeworkId,
        student: req.user!.userId,
        fileUrl,
        fileName: fileName || 'submission.pdf',
        status: isLate ? 'LATE' : 'SUBMITTED',
        submittedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return sendSuccess(res, submission, 'Homework submitted successfully');
  } catch (error) {
    next(error);
  }
};

export const getSubmissionsForHomework = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const submissions = await Submission.find({ homework: req.params.homeworkId })
      .populate('student', 'name email')
      .populate('evaluatedBy', 'name');

    return sendSuccess(res, submissions, 'Submissions retrieved');
  } catch (error) {
    next(error);
  }
};

export const evaluateSubmission = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { marksObtained, feedback } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      req.params.submissionId,
      {
        marksObtained,
        feedback,
        status: 'EVALUATED',
        evaluatedBy: req.user!.userId,
        evaluatedAt: new Date(),
      },
      { new: true }
    );

    if (!submission) throw AppError.notFound('Submission not found');
    return sendSuccess(res, submission, 'Submission evaluated');
  } catch (error) {
    next(error);
  }
};

export const getMySubmissions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const submissions = await Submission.find({ student: req.user!.userId })
      .populate({
        path: 'homework',
        populate: [{ path: 'subject', select: 'name code' }, { path: 'batch', select: 'name' }],
      })
      .sort({ submittedAt: -1 });

    return sendSuccess(res, submissions, 'My submissions retrieved');
  } catch (error) {
    next(error);
  }
};
