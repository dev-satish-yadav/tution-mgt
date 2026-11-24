import { Response, NextFunction } from 'express';
import { User } from '../users/user.model.js';
import { StudentProfile } from '../students/student.model.js';
import { TeacherProfile } from '../teachers/teacher.model.js';
import { Course } from '../courses/course.model.js';
import { Batch } from '../batches/batch.model.js';
import { Enquiry } from '../enquiries/enquiry.model.js';
import { Homework } from '../homework/homework.model.js';
import { Submission } from '../homework/submission.model.js';
import { Test } from '../tests/test.model.js';
import { TestAttempt } from '../tests/test-attempt.model.js';
import { Attendance } from '../attendance/attendance.model.js';
import { TeacherAssignment } from '../teachers/teacher-assignment.model.js';
import { Announcement } from '../announcements/announcement.model.js';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware.js';
import { sendSuccess } from '../../common/utils/response.js';

export const getAdminDashboard = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalBatches,
      totalCourses,
      totalEnquiries,
      newEnquiriesCount,
      recentEnquiries,
      grade11Count,
      grade12Count,
    ] = await Promise.all([
      StudentProfile.countDocuments(),
      TeacherProfile.countDocuments(),
      Batch.countDocuments({ isActive: true }),
      Course.countDocuments({ isActive: true }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'NEW' }),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
      StudentProfile.countDocuments({ grade: '11th' }),
      StudentProfile.countDocuments({ grade: '12th' }),
    ]);

    return sendSuccess(res, {
      stats: {
        totalStudents,
        totalTeachers,
        totalBatches,
        totalCourses,
        totalEnquiries,
        newEnquiriesCount,
      },
      distribution: [
        { name: '11th Commerce', value: grade11Count },
        { name: '12th Commerce', value: grade12Count },
      ],
      recentEnquiries,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const teacherId = req.user!.userId;
    const assignments = await TeacherAssignment.find({ teacher: teacherId })
      .populate('subject', 'name code grade')
      .populate('batch', 'name code grade scheduleTime');

    const batchIds = assignments.map((a) => a.batch?._id).filter(Boolean);

    const [activeHomeworkCount, upcomingTestsCount, totalAssignedStudents] = await Promise.all([
      Homework.countDocuments({ assignedBy: teacherId, dueDate: { $gte: new Date() } }),
      Test.countDocuments({ createdBy: teacherId, scheduledDate: { $gte: new Date() } }),
      StudentProfile.countDocuments({ batch: { $in: batchIds } }),
    ]);

    return sendSuccess(res, {
      stats: {
        assignedBatchesCount: batchIds.length,
        totalStudentsCount: totalAssignedStudents,
        activeHomeworkCount,
        upcomingTestsCount,
      },
      assignments,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user!.userId;
    const profile = await StudentProfile.findOne({ user: studentId }).populate('batch');

    const batchId = profile?.batch?._id;

    const [pendingHomework, upcomingTests, announcements, attendances] = await Promise.all([
      batchId
        ? Homework.find({ batch: batchId, dueDate: { $gte: new Date() } }).populate('subject', 'name code').limit(5)
        : [],
      batchId
        ? Test.find({ batch: batchId, scheduledDate: { $gte: new Date() } }).populate('subject', 'name code').limit(5)
        : [],
      Announcement.find({
        $or: [{ targetAudience: 'ALL' }, { targetAudience: 'STUDENTS' }],
      })
        .sort({ createdAt: -1 })
        .limit(5),
      Attendance.find({ 'records.student': studentId }),
    ]);

    // Calculate attendance percentage
    const totalDays = attendances.length;
    const presentDays = attendances.filter((att) => {
      const rec = att.records.find((r) => r.student.toString() === studentId);
      return rec?.status === 'PRESENT';
    }).length;

    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    return sendSuccess(res, {
      profile,
      stats: {
        attendanceRate,
        totalClasses: totalDays,
        presentClasses: presentDays,
        pendingHomeworkCount: pendingHomework.length,
        upcomingTestsCount: upcomingTests.length,
      },
      pendingHomework,
      upcomingTests,
      announcements,
    });
  } catch (error) {
    next(error);
  }
};
