import { Request, Response, NextFunction } from 'express';
import { Standard } from './standard.model.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AppError } from '../../common/errors/app.error.js';

export const getStandards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }
    if (req.query.stream) {
      filter.stream = req.query.stream;
    }

    const standards = await Standard.find(filter).sort({ order: 1, createdAt: 1 });
    return sendSuccess(res, standards, 'Standards fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getStandardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const standard = await Standard.findById(req.params.id);
    if (!standard) {
      throw AppError.notFound('Standard/Stream not found');
    }
    return sendSuccess(res, standard, 'Standard details fetched');
  } catch (error) {
    next(error);
  }
};

export const createStandard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, code, standard, stream, description, order, isActive } = req.body;

    const existing = await Standard.findOne({ code: code?.toUpperCase() });
    if (existing) {
      throw AppError.conflict('Standard with this code already exists');
    }

    const item = await Standard.create({
      name,
      code: code?.toUpperCase(),
      standard,
      stream: stream || 'Commerce',
      description,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    return sendSuccess(res, item, 'Standard/Stream created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateStandard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.code) {
      req.body.code = req.body.code.toUpperCase();
      const existing = await Standard.findOne({ code: req.body.code, _id: { $ne: req.params.id } });
      if (existing) {
        throw AppError.conflict('Another Standard with this code already exists');
      }
    }

    const updated = await Standard.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw AppError.notFound('Standard/Stream not found');
    }

    return sendSuccess(res, updated, 'Standard/Stream updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteStandard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await Standard.findByIdAndDelete(req.params.id);
    if (!deleted) {
      throw AppError.notFound('Standard/Stream not found');
    }
    return sendSuccess(res, null, 'Standard/Stream deleted successfully');
  } catch (error) {
    next(error);
  }
};
