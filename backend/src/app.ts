import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { config } from './config/env.js';
import { errorHandler } from './common/middleware/error.middleware.js';
import { AppError } from './common/errors/app.error.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import studentRoutes from './modules/students/student.routes.js';
import teacherRoutes from './modules/teachers/teacher.routes.js';
import standardRoutes from './modules/standards/standard.routes.js';
import courseRoutes from './modules/courses/course.routes.js';
import subjectRoutes from './modules/subjects/subject.routes.js';
import batchRoutes from './modules/batches/batch.routes.js';
import enrollmentRoutes from './modules/enrollments/enrollment.routes.js';
import materialRoutes from './modules/materials/material.routes.js';
import testRoutes from './modules/tests/test.routes.js';
import attendanceRoutes from './modules/attendance/attendance.routes.js';
import timetableRoutes from './modules/timetable/timetable.routes.js';
import announcementRoutes from './modules/announcements/announcement.routes.js';
import enquiryRoutes from './modules/enquiries/enquiry.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import websiteRoutes from './modules/website/website.routes.js';

export const createApp = () => {
  const app = express();

  // Basic security and request parsing
  app.use(helmet());
  app.use(
    cors({
      origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  if (config.nodeEnv !== 'production') {
    app.use(morgan('dev'));
  }

  // Rate limiting for auth and general endpoints
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
  });
  app.use('/api', apiLimiter);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Tuition Management System API',
      timestamp: new Date().toISOString(),
    });
  });

  // API v1 routes
  const v1 = express.Router();
  v1.use('/auth', authRoutes);
  v1.use('/students', studentRoutes);
  v1.use('/teachers', teacherRoutes);
  v1.use('/standards', standardRoutes);
  v1.use('/courses', courseRoutes);
  v1.use('/subjects', subjectRoutes);
  v1.use('/batches', batchRoutes);
  v1.use('/enrollments', enrollmentRoutes);
  v1.use('/materials', materialRoutes);
  v1.use('/tests', testRoutes);
  v1.use('/attendance', attendanceRoutes);
  v1.use('/timetable', timetableRoutes);
  v1.use('/announcements', announcementRoutes);
  v1.use('/enquiries', enquiryRoutes);
  v1.use('/dashboard', dashboardRoutes);
  v1.use('/website', websiteRoutes);

  app.use('/api/v1', v1);

  // 404 for unknown routes
  app.all('/api/*', (req, _res, next) => {
    next(AppError.notFound(`Cannot find endpoint ${req.originalUrl}`));
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
