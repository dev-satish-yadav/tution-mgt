import mongoose from 'mongoose';
import { User } from '../users/user.model.js';
import { TeacherProfile } from './teacher.model.js';
import { TeacherAssignment } from './teacher-assignment.model.js';
import { AppError } from '../../common/errors/app.error.js';

export interface CreateTeacherInput {
  name: string;
  email: string;
  password?: string;
  phone: string;
  qualification: string;
  specialization: string[];
  experienceYears?: number;
  bio?: string;
  employeeId?: string;
}

export class TeacherService {
  async createTeacher(input: CreateTeacherInput) {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw AppError.conflict('A user with this email already exists');
    }

    let employeeId = input.employeeId;
    if (!employeeId) {
      const count = await TeacherProfile.countDocuments();
      employeeId = `TCH${(count + 1).toString().padStart(3, '0')}`;
    }

    const defaultPassword = input.password || 'Teacher@123';

    const user = await User.create({
      name: input.name,
      email: input.email.toLowerCase(),
      password: defaultPassword,
      role: 'TEACHER',
      phone: input.phone,
    });

    const profile = await TeacherProfile.create({
      user: user._id,
      employeeId,
      qualification: input.qualification,
      specialization: input.specialization,
      phone: input.phone,
      experienceYears: input.experienceYears || 0,
      bio: input.bio,
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      profile,
    };
  }

  async getTeachers(query: { page?: number; limit?: number; search?: string; isActive?: string }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    const profileFilter: any = {};
    if (query.search || query.isActive !== undefined) {
      const userFilter: any = { role: 'TEACHER' };
      if (query.search) {
        userFilter.$or = [
          { name: { $regex: query.search, $options: 'i' } },
          { email: { $regex: query.search, $options: 'i' } },
        ];
      }
      if (query.isActive !== undefined) {
        userFilter.isActive = query.isActive === 'true';
      }
      const users = await User.find(userFilter).select('_id');
      const userIds = users.map((u) => u._id);
      profileFilter.user = { $in: userIds };
    }

    const [total, profiles] = await Promise.all([
      TeacherProfile.countDocuments(profileFilter),
      TeacherProfile.find(profileFilter)
        .populate('user', 'name email phone isActive lastLogin createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return {
      teachers: profiles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTeacherById(id: string) {
    const profile = await TeacherProfile.findOne({
      $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { user: mongoose.isValidObjectId(id) ? id : null }],
    }).populate('user', 'name email phone isActive lastLogin createdAt');

    if (!profile) {
      throw AppError.notFound('Teacher record not found');
    }
    return profile;
  }

  async assignTeacher(teacherId: string, subjectId: string, batchId: string) {
    const assignment = await TeacherAssignment.findOneAndUpdate(
      { teacher: teacherId, subject: subjectId, batch: batchId },
      { teacher: teacherId, subject: subjectId, batch: batchId, assignedAt: new Date() },
      { upsert: true, new: true }
    )
      .populate('subject', 'name code grade')
      .populate('batch', 'name code grade');

    return assignment;
  }

  async getTeacherAssignments(teacherUserId: string) {
    return TeacherAssignment.find({ teacher: teacherUserId })
      .populate('subject', 'name code grade')
      .populate('batch', 'name code grade scheduleTime');
  }
}

export const teacherService = new TeacherService();
