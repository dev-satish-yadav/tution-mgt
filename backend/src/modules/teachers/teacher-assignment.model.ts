import mongoose, { Document, Schema } from 'mongoose';

export interface ITeacherAssignment extends Document {
  teacher: mongoose.Types.ObjectId;
  subject: mongoose.Types.ObjectId;
  batch: mongoose.Types.ObjectId;
  assignedAt: Date;
}

const TeacherAssignmentSchema = new Schema<ITeacherAssignment>(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

TeacherAssignmentSchema.index({ teacher: 1, subject: 1, batch: 1 }, { unique: true });

export const TeacherAssignment = mongoose.model<ITeacherAssignment>('TeacherAssignment', TeacherAssignmentSchema);
