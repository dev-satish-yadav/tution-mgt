import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number; // 0-based
  marks: number;
  explanation?: string;
}

export interface ITest extends Document {
  title: string;
  description?: string;
  grade: '11th' | '12th';
  subject: mongoose.Types.ObjectId;
  batch: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  scheduledDate: Date;
  status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED';
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctOptionIndex: { type: Number, required: true },
    marks: { type: Number, default: 1 },
    explanation: { type: String },
  },
  { _id: true }
);

const TestSchema = new Schema<ITest>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 60,
    },
    totalMarks: {
      type: Number,
      required: true,
      default: 50,
    },
    passingMarks: {
      type: Number,
      default: 20,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'COMPLETED'],
      default: 'DRAFT',
      index: true,
    },
    questions: [QuestionSchema],
  },
  {
    timestamps: true,
  }
);

export const Test = mongoose.model<ITest>('Test', TestSchema);
