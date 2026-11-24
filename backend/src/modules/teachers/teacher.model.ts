import mongoose, { Document, Schema } from 'mongoose';

export interface ITeacherProfile extends Document {
  user: mongoose.Types.ObjectId;
  employeeId: string;
  qualification: string;
  specialization: string[]; // e.g. ['Accountancy', 'Economics']
  phone: string;
  experienceYears: number;
  bio?: string;
  joiningDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherProfileSchema = new Schema<ITeacherProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: [String],
      default: [],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      trim: true,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const TeacherProfile = mongoose.model<ITeacherProfile>('TeacherProfile', TeacherProfileSchema);
