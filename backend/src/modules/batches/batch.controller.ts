import { Request, Response, NextFunction } from 'express';
import { Batch } from './batch.model.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AppError } from '../../common/errors/app.error.js';

export const getBatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.grade) filter.grade = req.query.grade;
    if (req.query.standardId) filter.standard = req.query.standardId;
    if (req.query.subjectId) filter.subject = req.query.subjectId;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const batches = await Batch.find(filter)
      .populate('standard', 'name code standard stream')
      .populate('subject', 'name code')
      .sort({ createdAt: -1 });
    return sendSuccess(res, batches, 'Batches retrieved');
  } catch (error) {
    next(error);
  }
};

export const getBatchById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('standard', 'name code standard stream')
      .populate('subject', 'name code');
    if (!batch) throw AppError.notFound('Batch not found');
    return sendSuccess(res, batch, 'Batch details retrieved');
  } catch (error) {
    next(error);
  }
};

export const createBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batch = await Batch.create(req.body);
    const populated = await batch.populate([
      { path: 'standard', select: 'name code standard stream' },
      { path: 'subject', select: 'name code' },
    ]);
    return sendSuccess(res, populated, 'Batch created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('standard', 'name code standard stream')
      .populate('subject', 'name code');
    if (!batch) throw AppError.notFound('Batch not found');
    return sendSuccess(res, batch, 'Batch updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) throw AppError.notFound('Batch not found');
    return sendSuccess(res, null, 'Batch deleted successfully');
  } catch (error) {
    next(error);
  }
};
