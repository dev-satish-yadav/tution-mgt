import mongoose, { Document, Schema } from 'mongoose';

export interface IStudentProfile extends Document {
  user: mongoose.Types.ObjectId;
  rollNo: string;
  grade: '11th' | '12th';
  stream: string; // e.g. Commerce
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address?: string;
  dateOfBirth?: Date;
  admissionDate: Date;
  batch?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    rollNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    grade: {
      type: String,
      enum: ['11th', '12th'],
      required: true,
      index: true,
    },
    stream: {
      type: String,
      default: 'Commerce',
    },
    parentName: {
      type: String,
      required: [true, 'Parent/Guardian name is required'],
      trim: true,
    },
    parentPhone: {
      type: String,
      required: [true, 'Parent contact number is required'],
      trim: true,
    },
    parentEmail: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    batch: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
