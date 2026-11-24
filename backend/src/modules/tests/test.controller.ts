import { Response, NextFunction } from 'express';
import { Test } from './test.model.js';
import { TestAttempt } from './test-attempt.model.js';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AppError } from '../../common/errors/app.error.js';

export const getTests = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.grade) filter.grade = req.query.grade;
    if (req.query.batchId) filter.batch = req.query.batchId;
    if (req.query.subjectId) filter.subject = req.query.subjectId;

    // Students should only see PUBLISHED or COMPLETED tests
    if (req.user?.role === 'STUDENT') {
      filter.status = { $in: ['PUBLISHED', 'COMPLETED'] };
    }

    const tests = await Test.find(filter)
      .populate('subject', 'name code')
      .populate('batch', 'name code')
      .populate('createdBy', 'name')
      .select(req.user?.role === 'STUDENT' ? '-questions.correctOptionIndex -questions.explanation' : '')
      .sort({ scheduledDate: -1 });

    return sendSuccess(res, tests, 'Tests retrieved');
  } catch (error) {
    next(error);
  }
};

export const getTestById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('subject', 'name code')
      .populate('batch', 'name code');

    if (!test) throw AppError.notFound('Test not found');

    const isStudent = req.user?.role === 'STUDENT';
    const testData: any = test.toObject();
    if (isStudent) {
      testData.questions = testData.questions.map((q: any) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        marks: q.marks,
      }));
    }

    return sendSuccess(res, testData, 'Test details retrieved');
  } catch (error) {
    next(error);
  }
};

export const createTest = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, grade, subjectId, batchId, durationMinutes, totalMarks, passingMarks, scheduledDate, questions } = req.body;

    const test = await Test.create({
      title,
      description,
      grade,
      subject: subjectId,
      batch: batchId,
      createdBy: req.user!.userId,
      durationMinutes: durationMinutes || 60,
      totalMarks: totalMarks || 50,
      passingMarks: passingMarks || 20,
      scheduledDate,
      status: 'PUBLISHED',
      questions: questions || [],
    });

    return sendSuccess(res, test, 'Test created and published successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const submitTestAttempt = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { answers } = req.body;
    const test = await Test.findById(req.params.id);
    if (!test) throw AppError.notFound('Test not found');

    let totalScore = 0;
    const evaluatedAnswers = (answers || []).map((ans: any) => {
      const q = test.questions[ans.questionIndex];
      const isCorrect = q && q.correctOptionIndex === ans.selectedOptionIndex;
      const marksAwarded = isCorrect ? (q.marks || 1) : 0;
      totalScore += marksAwarded;

      return {
        questionIndex: ans.questionIndex,
        selectedOptionIndex: ans.selectedOptionIndex,
        isCorrect,
        marksAwarded,
      };
    });

    const isPassed = totalScore >= test.passingMarks;

    const attempt = await TestAttempt.findOneAndUpdate(
      { test: test._id, student: req.user!.userId },
      {
        test: test._id,
        student: req.user!.userId,
        answers: evaluatedAnswers,
        totalScore,
        maxScore: test.totalMarks,
        isPassed,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return sendSuccess(res, attempt, 'Test submitted successfully. Your score has been computed.');
  } catch (error) {
    next(error);
  }
};

export const getMyAttempts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const attempts = await TestAttempt.find({ student: req.user!.userId })
      .populate({
        path: 'test',
        populate: [{ path: 'subject', select: 'name code' }, { path: 'batch', select: 'name' }],
      })
      .sort({ submittedAt: -1 });

    return sendSuccess(res, attempts, 'My test attempts retrieved');
  } catch (error) {
    next(error);
  }
};

export const getAttemptsForTest = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const attempts = await TestAttempt.find({ test: req.params.testId })
      .populate('student', 'name email')
      .sort({ totalScore: -1 });

    return sendSuccess(res, attempts, 'Test performance leaderboard retrieved');
  } catch (error) {
    next(error);
  }
};
