import { Response, NextFunction } from 'express';
import { Announcement } from './announcement.model.js';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware.js';
import { sendSuccess } from '../../common/utils/response.js';

export const getAnnouncements = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};

    if (req.user?.role === 'STUDENT') {
      filter.$or = [{ targetAudience: 'ALL' }, { targetAudience: 'STUDENTS' }];
    } else if (req.user?.role === 'TEACHER') {
      filter.$or = [{ targetAudience: 'ALL' }, { targetAudience: 'TEACHERS' }];
    }

    const announcements = await Announcement.find(filter)
      .populate('publishedBy', 'name role')
      .populate('batch', 'name')
      .sort({ createdAt: -1 });

    return sendSuccess(res, announcements, 'Announcements retrieved');
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, targetAudience, batchId, grade, priority } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      targetAudience: targetAudience || 'ALL',
      batch: batchId || undefined,
      grade: grade || undefined,
      publishedBy: req.user!.userId,
      priority: priority || 'NORMAL',
    });

    return sendSuccess(res, announcement, 'Announcement published', 201);
  } catch (error) {
    next(error);
  }
};
