import mongoose, { Document, Schema } from 'mongoose';

export interface ISlot {
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // "09:00 AM"
  endTime: string;   // "10:30 AM"
  subject: mongoose.Types.ObjectId;
  teacher?: mongoose.Types.ObjectId;
  room?: string;
}

export interface ITimetable extends Document {
  batch: mongoose.Types.ObjectId;
  slots: ISlot[];
  createdAt: Date;
  updatedAt: Date;
}

const SlotSchema = new Schema<ISlot>(
  {
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    room: { type: String, default: 'Classroom 1' },
  },
  { _id: true }
);

const TimetableSchema = new Schema<ITimetable>(
  {
    batch: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
      unique: true,
      index: true,
    },
    slots: [SlotSchema],
  },
  {
    timestamps: true,
  }
);

export const Timetable = mongoose.model<ITimetable>('Timetable', TimetableSchema);
