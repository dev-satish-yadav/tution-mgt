import { Request, Response, NextFunction } from 'express';
import { Subject } from './subject.model.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AppError } from '../../common/errors/app.error.js';

export const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.grade) filter.grade = req.query.grade;
    if (req.query.courseId) filter.course = req.query.courseId;

    const subjects = await Subject.find(filter).populate('course', 'title grade').sort({ order: 1 });
    return sendSuccess(res, subjects, 'Subjects fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await Subject.create(req.body);
    return sendSuccess(res, subject, 'Subject created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subject) throw AppError.notFound('Subject not found');
    return sendSuccess(res, subject, 'Subject updated successfully');
  } catch (error) {
    next(error);
  }
};

export const addChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) throw AppError.notFound('Subject not found');

    subject.chapters.push(req.body);
    await subject.save();
    return sendSuccess(res, subject, 'Chapter added to subject');
  } catch (error) {
    next(error);
  }
};
