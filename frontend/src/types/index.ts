export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  profile?: any;
}

export interface WebsiteSettings {
  instituteName: string;
  instituteShortName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;

  // Feature / Navigation toggles
  showGrade11: boolean;
  showGrade12: boolean;
  showAdmissions: boolean;

  heroTitle?: string;
  heroSubtitle?: string;
  bannerNotice?: string;
}

export interface Standard {
  _id: string;
  name: string;
  code: string;
  standard: string;
  stream: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
}

export interface Subject {
  _id: string;
  name: string;
  code?: string;
  grade?: string;
  standard: Standard | string;
  description?: string;
  order: number;
  isActive?: boolean;
}

export interface Batch {
  _id: string;
  name: string;
  code: string;
  grade?: string;
  standard?: Standard | string;
  subject?: Subject | string;
  academicYear: string;
  scheduleTime: string;
  maxCapacity: number;
  currentEnrollment: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    isActive: boolean;
  };
  rollNo: string;
  grade: '11th' | '12th';
  stream: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address?: string;
  admissionDate: string;
  batch?: Batch;
}

export interface Teacher {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    isActive: boolean;
  };
  employeeId: string;
  qualification: string;
  specialization: string[];
  phone: string;
  experienceYears: number;
  bio?: string;
  joiningDate: string;
}

export interface StudyMaterial {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  grade: '11th' | '12th';
  subject: Subject;
  batch?: Batch;
  chapter?: string;
  uploadedBy: {
    name: string;
    role: string;
  };
  createdAt: string;
}

export interface Question {
  _id?: string;
  questionText: string;
  options: string[];
  correctOptionIndex?: number;
  marks: number;
  explanation?: string;
}

export interface Test {
  _id: string;
  title: string;
  description?: string;
  grade: '11th' | '12th';
  subject: Subject;
  batch: Batch;
  createdBy: {
    name: string;
  };
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  scheduledDate: string;
  status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED';
  questions: Question[];
}

export interface TestAttempt {
  _id: string;
  test: Test;
  student: string | { name: string; email: string };
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
  submittedAt: string;
}

export interface AttendanceRecord {
  date: string;
  subject: Subject;
  batch: Batch;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  targetAudience: 'ALL' | 'STUDENTS' | 'TEACHERS' | 'BATCH';
  batch?: Batch;
  grade?: '11th' | '12th';
  publishedBy: {
    name: string;
    role: string;
  };
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  createdAt: string;
}

export interface Enquiry {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  grade: '11th' | '12th';
  schoolName?: string;
  subjectsOfInterest?: string[];
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'REJECTED';
  adminNotes?: string;
  createdAt: string;
}
