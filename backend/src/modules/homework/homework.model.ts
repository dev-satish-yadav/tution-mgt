import mongoose, { Document, Schema } from 'mongoose';

export interface IHomework extends Document {
  title: string;
  description: string;
  grade: '11th' | '12th';
  subject: mongoose.Types.ObjectId;
  batch: mongoose.Types.ObjectId;
  assignedBy: mongoose.Types.ObjectId;
  dueDate: Date;
  totalMarks?: number;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HomeworkSchema = new Schema<IHomework>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      enum: ['11th', '12th'],
      required: true,
      index: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    batch: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
      index: true,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    totalMarks: {
      type: Number,
      default: 20,
    },
    attachmentUrl: {
      type: String,
    },
    attachmentName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Homework = mongoose.model<IHomework>('Homework', HomeworkSchema);
