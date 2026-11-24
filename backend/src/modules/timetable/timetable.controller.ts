import { Response, NextFunction } from 'express';
import { Timetable } from './timetable.model.js';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware.js';
import { sendSuccess } from '../../common/utils/response.js';

export const getBatchTimetable = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const timetable = await Timetable.findOne({ batch: req.params.batchId })
      .populate('batch', 'name code')
      .populate('slots.subject', 'name code')
      .populate('slots.teacher', 'name email');

    return sendSuccess(res, timetable, 'Timetable retrieved');
  } catch (error) {
    next(error);
  }
};

export const saveBatchTimetable = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { batchId, slots } = req.body;

    const timetable = await Timetable.findOneAndUpdate(
      { batch: batchId },
      { batch: batchId, slots: slots || [] },
      { upsert: true, new: true }
    )
      .populate('slots.subject', 'name code')
      .populate('slots.teacher', 'name');

    return sendSuccess(res, timetable, 'Timetable updated successfully');
  } catch (error) {
    next(error);
  }
};
