import mongoose, { Document, Schema } from 'mongoose';

export interface ITestAttempt extends Document {
  test: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  answers: {
    questionIndex: number;
    selectedOptionIndex: number;
    isCorrect: boolean;
    marksAwarded: number;
  }[];
  totalScore: number;
  maxScore: number;
  isPassed: boolean;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED';
  startedAt: Date;
  submittedAt?: Date;
}

const TestAttemptSchema = new Schema<ITestAttempt>(
  {
    test: {
      type: Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    answers: [
      {
        questionIndex: { type: Number, required: true },
        selectedOptionIndex: { type: Number, required: true },
        isCorrect: { type: Boolean, default: false },
        marksAwarded: { type: Number, default: 0 },
      },
    ],
    totalScore: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    isPassed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'SUBMITTED', 'EVALUATED'],
      default: 'SUBMITTED',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

TestAttemptSchema.index({ test: 1, student: 1 }, { unique: true });

export const TestAttempt = mongoose.model<ITestAttempt>('TestAttempt', TestAttemptSchema);
