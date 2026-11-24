import mongoose, { Document, Schema } from 'mongoose';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface IAttendanceRecord {
  student: mongoose.Types.ObjectId;
  status: AttendanceStatus;
  remarks?: string;
}

export interface IAttendance extends Document {
  batch: mongoose.Types.ObjectId;
  subject: mongoose.Types.ObjectId;
  date: Date;
  markedBy: mongoose.Types.ObjectId;
  records: IAttendanceRecord[];
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'],
      default: 'PRESENT',
    },
    remarks: {
      type: String,
    },
  },
  { _id: false }
);

const AttendanceSchema = new Schema<IAttendance>(
  {
    batch: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
      index: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    records: [AttendanceRecordSchema],
  },
  {
    timestamps: true,
  }
);

AttendanceSchema.index({ batch: 1, subject: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
