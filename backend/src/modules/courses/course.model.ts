import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  slug: string;
  grade: '11th' | '12th' | string;
  stream: string;
  standard?: mongoose.Types.ObjectId;
  description: string;
  features: string[];
  durationMonths: number;
  feeAmount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    grade: {
      type: String,
      required: true,
      index: true,
    },
    stream: {
      type: String,
      default: 'Commerce',
    },
    standard: {
      type: Schema.Types.ObjectId,
      ref: 'Standard',
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    durationMonths: {
      type: Number,
      default: 12,
    },
    feeAmount: {
      type: Number,
      required: true,
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

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
