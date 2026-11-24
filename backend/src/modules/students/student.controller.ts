import { Request, Response, NextFunction } from 'express';
import { studentService } from './student.service.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware.js';
import { AppError } from '../../common/errors/app.error.js';

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await studentService.createStudent(req.body);
    return sendSuccess(res, result, 'Student created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await studentService.getStudents({
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      search: req.query.search as string,
      grade: req.query.grade as string,
      batchId: req.query.batchId as string,
      isActive: req.query.isActive as string,
    });
    return sendSuccess(res, result.students, 'Students retrieved successfully', 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    // If student role, they can only view their own profile
    if (req.user?.role === 'STUDENT' && req.user.userId !== id) {
      throw AppError.forbidden('Students can only access their own profile');
    }
    const student = await studentService.getStudentById(id);
    return sendSuccess(res, student, 'Student details retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const updated = await studentService.updateStudent(id, req.body);
    return sendSuccess(res, updated, 'Student updated successfully');
  } catch (error) {
    next(error);
  }
};
