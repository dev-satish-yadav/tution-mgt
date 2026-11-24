import { Request, Response, NextFunction } from 'express';
import { Course } from './course.model.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AppError } from '../../common/errors/app.error.js';

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.grade) filter.grade = req.query.grade;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const courses = await Course.find(filter).sort({ grade: 1 });
    return sendSuccess(res, courses, 'Courses fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getCourseBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      throw AppError.notFound('Course not found');
    }
    return sendSuccess(res, course, 'Course details fetched');
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await Course.create(req.body);
    return sendSuccess(res, course, 'Course created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) throw AppError.notFound('Course not found');
    return sendSuccess(res, course, 'Course updated successfully');
  } catch (error) {
    next(error);
  }
};
