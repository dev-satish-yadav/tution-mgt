import { Request, Response, NextFunction } from 'express';
import { Batch } from './batch.model.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AppError } from '../../common/errors/app.error.js';

export const getBatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.grade) filter.grade = req.query.grade;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const batches = await Batch.find(filter)
      .populate('course', 'title grade')
      .populate('standard', 'name code standard stream')
      .sort({ createdAt: -1 });
    return sendSuccess(res, batches, 'Batches retrieved');
  } catch (error) {
    next(error);
  }
};

export const getBatchById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('course', 'title grade')
      .populate('standard', 'name code standard stream');
    if (!batch) throw AppError.notFound('Batch not found');
    return sendSuccess(res, batch, 'Batch details retrieved');
  } catch (error) {
    next(error);
  }
};

export const createBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batch = await Batch.create(req.body);
    return sendSuccess(res, batch, 'Batch created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!batch) throw AppError.notFound('Batch not found');
    return sendSuccess(res, batch, 'Batch updated successfully');
  } catch (error) {
    next(error);
  }
};
