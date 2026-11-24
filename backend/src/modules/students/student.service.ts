import mongoose from 'mongoose';
import { User } from '../users/user.model.js';
import { StudentProfile } from './student.model.js';
import { Batch } from '../batches/batch.model.js';
import { Enrollment } from '../enrollments/enrollment.model.js';
import { AppError } from '../../common/errors/app.error.js';

export interface CreateStudentInput {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  grade: '11th' | '12th';
  rollNo?: string;
  stream?: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address?: string;
  dateOfBirth?: Date;
  batchId?: string;
}

export class StudentService {
  async createStudent(input: CreateStudentInput) {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw AppError.conflict('A user with this email already exists');
    }

    // Auto-generate roll number if not provided: e.g. "COM-11-001" or timestamp-based
    let rollNo = input.rollNo;
    if (!rollNo) {
      const count = await StudentProfile.countDocuments({ grade: input.grade });
      const year = new Date().getFullYear().toString().slice(-2);
      rollNo = `C${input.grade.slice(0, 2)}${year}${(count + 1).toString().padStart(4, '0')}`;
    }

    const existingRoll = await StudentProfile.findOne({ rollNo });
    if (existingRoll) {
      throw AppError.conflict('Student with this roll number already exists');
    }

    const defaultPassword = input.password || 'Student@123';

    // Create User record
    const user = await User.create({
      name: input.name,
      email: input.email.toLowerCase(),
      password: defaultPassword,
      role: 'STUDENT',
      phone: input.phone || input.parentPhone,
    });

    // Create StudentProfile record
    const profile = await StudentProfile.create({
      user: user._id,
      rollNo,
      grade: input.grade,
      stream: input.stream || 'Commerce',
      parentName: input.parentName,
      parentPhone: input.parentPhone,
      parentEmail: input.parentEmail,
      address: input.address,
      dateOfBirth: input.dateOfBirth,
      batch: input.batchId ? new mongoose.Types.ObjectId(input.batchId) : undefined,
    });

    // If batchId supplied, enroll student in batch
    if (input.batchId) {
      await Enrollment.create({
        student: user._id,
        batch: input.batchId,
        status: 'ACTIVE',
      });
      await Batch.findByIdAndUpdate(input.batchId, { $inc: { currentEnrollment: 1 } });
    }

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

  async getStudents(query: {
    page?: number;
    limit?: number;
    search?: string;
    grade?: string;
    batchId?: string;
    isActive?: string;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    const profileFilter: any = {};
    if (query.grade) profileFilter.grade = query.grade;
    if (query.batchId) profileFilter.batch = query.batchId;

    let userIds: mongoose.Types.ObjectId[] | null = null;
    if (query.search || query.isActive !== undefined) {
      const userFilter: any = { role: 'STUDENT' };
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
      userIds = users.map((u) => u._id as mongoose.Types.ObjectId);
      profileFilter.user = { $in: userIds };
    }

    const [total, profiles] = await Promise.all([
      StudentProfile.countDocuments(profileFilter),
      StudentProfile.find(profileFilter)
        .populate('user', 'name email phone isActive lastLogin createdAt')
        .populate('batch', 'name code scheduleTime academicYear')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return {
      students: profiles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStudentById(id: string) {
    const profile = await StudentProfile.findOne({
      $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { user: mongoose.isValidObjectId(id) ? id : null }],
    })
      .populate('user', 'name email phone isActive lastLogin createdAt')
      .populate('batch', 'name code scheduleTime academicYear');

    if (!profile) {
      throw AppError.notFound('Student record not found');
    }
    return profile;
  }

  async updateStudent(
    id: string,
    updateData: {
      name?: string;
      phone?: string;
      parentName?: string;
      parentPhone?: string;
      address?: string;
      grade?: '11th' | '12th';
      batchId?: string;
      isActive?: boolean;
    }
  ) {
    const profile = await StudentProfile.findById(id);
    if (!profile) {
      throw AppError.notFound('Student profile not found');
    }

    if (updateData.name || updateData.phone || updateData.isActive !== undefined) {
      const userUpdate: any = {};
      if (updateData.name) userUpdate.name = updateData.name;
      if (updateData.phone) userUpdate.phone = updateData.phone;
      if (updateData.isActive !== undefined) userUpdate.isActive = updateData.isActive;
      await User.findByIdAndUpdate(profile.user, userUpdate);
    }

    if (updateData.parentName) profile.parentName = updateData.parentName;
    if (updateData.parentPhone) profile.parentPhone = updateData.parentPhone;
    if (updateData.address !== undefined) profile.address = updateData.address;
    if (updateData.grade) profile.grade = updateData.grade;

    if (updateData.batchId && updateData.batchId !== profile.batch?.toString()) {
      if (profile.batch) {
        await Batch.findByIdAndUpdate(profile.batch, { $inc: { currentEnrollment: -1 } });
      }
      profile.batch = new mongoose.Types.ObjectId(updateData.batchId);
      await Batch.findByIdAndUpdate(updateData.batchId, { $inc: { currentEnrollment: 1 } });
    }

    await profile.save();
    return this.getStudentById(profile._id.toString());
  }
}

export const studentService = new StudentService();
