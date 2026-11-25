import mongoose, { Document, Schema } from 'mongoose';

export interface IWebsiteSettings extends Document {
  instituteName: string;
  instituteShortName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;

  // Feature / Navigation toggles (Disabled by default as requested)
  showGrade11: boolean;
  showGrade12: boolean;
  showAdmissions: boolean;

  // Hero & Content
  heroTitle: string;
  heroSubtitle: string;
  bannerNotice: string;

  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const WebsiteSettingsSchema = new Schema<IWebsiteSettings>(
  {
    instituteName: {
      type: String,
      default: 'Apex Commerce Academy',
    },
    instituteShortName: {
      type: String,
      default: 'Apex Commerce',
    },
    tagline: {
      type: String,
      default: '11th & 12th Commerce Excellence',
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    email: {
      type: String,
      default: 'admissions@apexcommerce.edu',
    },
    address: {
      type: String,
      default: '402 Apex Towers, Commerce Plaza, MG Road, Mumbai - 400001',
    },
    whatsappNumber: {
      type: String,
      default: '919876543210',
    },

    // Default toggles are FALSE per user requirement
    showGrade11: {
      type: Boolean,
      default: false,
    },
    showGrade12: {
      type: Boolean,
      default: false,
    },
    showAdmissions: {
      type: Boolean,
      default: false,
    },

    heroTitle: {
      type: String,
      default: 'Master Commerce with Top Board Rankers',
    },
    heroSubtitle: {
      type: String,
      default: 'Specialized coaching & digital LMS platform for Accountancy, Economics, Business Studies, and Statistics.',
    },
    bannerNotice: {
      type: String,
      default: 'Admissions Open for Academic Year 2026-2027',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const WebsiteSettings = mongoose.model<IWebsiteSettings>('WebsiteSettings', WebsiteSettingsSchema);
