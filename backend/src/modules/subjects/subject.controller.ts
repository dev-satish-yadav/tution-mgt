import { Request, Response, NextFunction } from 'express';
import { Subject } from './subject.model.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AppError } from '../../common/errors/app.error.js';

export const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.standardId) filter.standard = req.query.standardId;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const subjects = await Subject.find(filter)
      .populate('standard', 'name code standard stream')
      .sort({ order: 1, createdAt: 1 });
    return sendSuccess(res, subjects, 'Subjects fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getSubjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('standard', 'name code standard stream');
    if (!subject) throw AppError.notFound('Subject not found');
    return sendSuccess(res, subject, 'Subject details fetched');
  } catch (error) {
    next(error);
  }
};

export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, code, standard, description, order, isActive } = req.body;
    if (!name || !standard) {
      throw AppError.badRequest('Subject name and standard are required');
    }

    const subject = await Subject.create({
      name,
      code: code ? code.toUpperCase() : undefined,
      standard,
      description,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    const populated = await subject.populate('standard', 'name code standard stream');
    return sendSuccess(res, populated, 'Subject created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.code) {
      req.body.code = req.body.code.toUpperCase();
    }
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('standard', 'name code standard stream');
    if (!subject) throw AppError.notFound('Subject not found');
    return sendSuccess(res, subject, 'Subject updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) throw AppError.notFound('Subject not found');
    return sendSuccess(res, null, 'Subject deleted successfully');
  } catch (error) {
    next(error);
  }
};
