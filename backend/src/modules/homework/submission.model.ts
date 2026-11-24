import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  homework: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  fileUrl: string;
  fileName: string;
  status: 'SUBMITTED' | 'EVALUATED' | 'LATE';
  marksObtained?: number;
  feedback?: string;
  evaluatedBy?: mongoose.Types.ObjectId;
  submittedAt: Date;
  evaluatedAt?: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    homework: {
      type: Schema.Types.ObjectId,
      ref: 'Homework',
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'EVALUATED', 'LATE'],
      default: 'SUBMITTED',
      index: true,
    },
    marksObtained: {
      type: Number,
    },
    feedback: {
      type: String,
    },
    evaluatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    evaluatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

SubmissionSchema.index({ homework: 1, student: 1 }, { unique: true });

export const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);
