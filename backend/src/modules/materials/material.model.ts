import mongoose, { Document, Schema } from 'mongoose';

export interface IStudyMaterial extends Document {
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  grade: '11th' | '12th';
  subject: mongoose.Types.ObjectId;
  batch?: mongoose.Types.ObjectId;
  chapter?: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StudyMaterialSchema = new Schema<IStudyMaterial>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
    },
    mimeType: {
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
      index: true,
    },
    chapter: {
      type: String,
      trim: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const StudyMaterial = mongoose.model<IStudyMaterial>('StudyMaterial', StudyMaterialSchema);
