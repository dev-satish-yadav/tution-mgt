import mongoose, { Document, Schema } from 'mongoose';

export type TargetAudience = 'ALL' | 'STUDENTS' | 'TEACHERS' | 'BATCH';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  targetAudience: TargetAudience;
  batch?: mongoose.Types.ObjectId;
  grade?: '11th' | '12th';
  publishedBy: mongoose.Types.ObjectId;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    targetAudience: {
      type: String,
      enum: ['ALL', 'STUDENTS', 'TEACHERS', 'BATCH'],
      default: 'ALL',
      index: true,
    },
    batch: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      index: true,
    },
    grade: {
      type: String,
      enum: ['11th', '12th'],
      index: true,
    },
    publishedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL',
    },
  },
  {
    timestamps: true,
  }
);

export const Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
