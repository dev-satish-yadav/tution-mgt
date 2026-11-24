import mongoose, { Document, Schema } from 'mongoose';

export interface IBatch extends Document {
  name: string; // e.g. "12th Commerce Morning Star"
  code: string; // e.g. "12C-MORN-2026"
  grade: '11th' | '12th';
  course: mongoose.Types.ObjectId;
  academicYear: string; // e.g. "2026-2027"
  scheduleTime: string; // e.g. "08:00 AM - 11:30 AM"
  maxCapacity: number;
  currentEnrollment: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema = new Schema<IBatch>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    grade: {
      type: String,
      enum: ['11th', '12th'],
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      default: '2026-2027',
    },
    scheduleTime: {
      type: String,
      required: true,
    },
    maxCapacity: {
      type: Number,
      default: 40,
    },
    currentEnrollment: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Batch = mongoose.model<IBatch>('Batch', BatchSchema);
