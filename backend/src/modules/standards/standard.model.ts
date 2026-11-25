import mongoose, { Document, Schema } from 'mongoose';

export interface IStandard extends Document {
  name: string; // e.g. "12th Commerce", "11th Commerce", "10th Foundation"
  code: string; // e.g. "STD-12-COMM", "STD-11-COMM"
  standard: string; // e.g. "12th", "11th"
  stream: string; // e.g. "Commerce", "Arts", "Science", "General"
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StandardSchema = new Schema<IStandard>(
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
      trim: true,
      uppercase: true,
      index: true,
    },
    standard: {
      type: String,
      required: true,
      trim: true, // e.g. "11th", "12th"
    },
    stream: {
      type: String,
      required: true,
      default: 'Commerce',
      trim: true, // e.g. "Commerce", "Science"
    },
    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Standard = mongoose.model<IStandard>('Standard', StandardSchema);
