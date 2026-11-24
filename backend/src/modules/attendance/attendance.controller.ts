import { Response, NextFunction } from 'express';
import { Attendance } from './attendance.model.js';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware.js';
import { sendSuccess } from '../../common/utils/response.js';

export const markAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { batchId, subjectId, date, records } = req.body;

    const attendanceDate = new Date(date || new Date().toISOString().split('T')[0]);

    const attendance = await Attendance.findOneAndUpdate(
      { batch: batchId, subject: subjectId, date: attendanceDate },
      {
        batch: batchId,
        subject: subjectId,
        date: attendanceDate,
        markedBy: req.user!.userId,
        records: records || [],
      },
      { upsert: true, new: true }
    );

    return sendSuccess(res, attendance, 'Attendance marked successfully');
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.batchId) filter.batch = req.query.batchId;
    if (req.query.subjectId) filter.subject = req.query.subjectId;
    if (req.query.date) filter.date = new Date(req.query.date as string);

    const attendances = await Attendance.find(filter)
      .populate('batch', 'name code')
      .populate('subject', 'name code')
      .populate('records.student', 'name email')
      .sort({ date: -1 });

    return sendSuccess(res, attendances, 'Attendance records retrieved');
  } catch (error) {
    next(error);
  }
};

export const getStudentAttendanceSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.role === 'STUDENT' ? req.user.userId : (req.query.studentId as string);

    const attendances = await Attendance.find({
      'records.student': studentId,
    })
      .populate('subject', 'name code')
      .populate('batch', 'name code')
      .sort({ date: -1 });

    const history = attendances.map((att) => {
      const rec = att.records.find((r) => r.student.toString() === studentId);
      return {
        date: att.date,
        subject: att.subject,
        batch: att.batch,
        status: rec?.status || 'ABSENT',
        remarks: rec?.remarks,
      };
    });

    const totalDays = history.length;
    const presentDays = history.filter((h) => h.status === 'PRESENT').length;
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    return sendSuccess(
      res,
      {
        totalDays,
        presentDays,
        percentage,
        history,
      },
      'Student attendance summary retrieved'
    );
  } catch (error) {
    next(error);
  }
};
