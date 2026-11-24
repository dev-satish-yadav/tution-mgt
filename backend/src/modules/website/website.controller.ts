import { Request, Response, NextFunction } from 'express';
import { WebsiteSettings } from './website-settings.model.js';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware.js';
import { sendSuccess } from '../../common/utils/response.js';

export const getWebsiteSettings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create({});
    }
    return sendSuccess(res, settings, 'Website settings retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateWebsiteSettings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updateData = {
      ...req.body,
      updatedBy: req.user?.userId,
    };

    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create(updateData);
    } else {
      Object.assign(settings, updateData);
      await settings.save();
    }

    return sendSuccess(res, settings, 'Website settings and navigation toggles updated successfully');
  } catch (error) {
    next(error);
  }
};
