import mongoose, { Document, Schema } from 'mongoose';

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'CONVERTED' | 'REJECTED';

export interface IEnquiry extends Document {
  fullName: string;
  email: string;
  phone: string;
  grade: '11th' | '12th';
  schoolName?: string;
  subjectsOfInterest?: string[];
  message?: string;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: String,
      enum: ['11th', '12th'],
      required: true,
      index: true,
    },
    schoolName: {
      type: String,
      trim: true,
    },
    subjectsOfInterest: {
      type: [String],
      default: [],
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'CONVERTED', 'REJECTED'],
      default: 'NEW',
      index: true,
    },
    adminNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
