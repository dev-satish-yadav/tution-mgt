import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  batch: mongoose.Types.ObjectId;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  enrolledAt: Date;
  notes?: string;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    batch: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
      default: 'ACTIVE',
      index: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active enrollments in the same batch
EnrollmentSchema.index({ student: 1, batch: 1 }, { unique: true });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
