import { Request, Response, NextFunction } from 'express';
import { teacherService } from './teacher.service.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware.js';

export const createTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await teacherService.createTeacher(req.body);
    return sendSuccess(res, result, 'Teacher account created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getTeachers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await teacherService.getTeachers({
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      search: req.query.search as string,
      isActive: req.query.isActive as string,
    });
    return sendSuccess(res, result.teachers, 'Teachers list retrieved', 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const teacher = await teacherService.getTeacherById(id);
    return sendSuccess(res, teacher, 'Teacher details retrieved');
  } catch (error) {
    next(error);
  }
};

export const assignTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teacherId, subjectId, batchId } = req.body;
    const assignment = await teacherService.assignTeacher(teacherId, subjectId, batchId);
    return sendSuccess(res, assignment, 'Teacher assigned to subject and batch successfully');
  } catch (error) {
    next(error);
  }
};

export const getMyAssignments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const assignments = await teacherService.getTeacherAssignments(req.user!.userId);
    return sendSuccess(res, assignments, 'Teacher assignments retrieved');
  } catch (error) {
    next(error);
  }
};
