import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  grade: '11th' | '12th' | string;
  standard?: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  description?: string;
  order: number;
  chapters: {
    title: string;
    chapterNumber: number;
    description?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
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
      required: true,
      index: true,
    },
    standard: {
      type: Schema.Types.ObjectId,
      ref: 'Standard',
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 1,
    },
    chapters: [
      {
        title: { type: String, required: true },
        chapterNumber: { type: Number, required: true },
        description: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);
