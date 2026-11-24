import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { config } from '../config/env.js';
import { User } from '../modules/users/user.model.js';
import { Course } from '../modules/courses/course.model.js';
import { Subject } from '../modules/subjects/subject.model.js';
import { Batch } from '../modules/batches/batch.model.js';
import { StudentProfile } from '../modules/students/student.model.js';
import { TeacherProfile } from '../modules/teachers/teacher.model.js';
import { TeacherAssignment } from '../modules/teachers/teacher-assignment.model.js';
import { Enrollment } from '../modules/enrollments/enrollment.model.js';
import { Announcement } from '../modules/announcements/announcement.model.js';
import { StudyMaterial } from '../modules/materials/material.model.js';
import { Homework } from '../modules/homework/homework.model.js';
import { Test } from '../modules/tests/test.model.js';

export const seedData = async () => {
  try {
    await connectDatabase();
    console.log('[Seed] Starting database seed...');

    // 1. Seed or update Admin
    let admin = await User.findOne({ email: config.adminSeed.email.toLowerCase() });
    if (!admin) {
      admin = await User.create({
        name: config.adminSeed.name,
        email: config.adminSeed.email.toLowerCase(),
        password: config.adminSeed.password,
        role: 'ADMIN',
        phone: config.adminSeed.phone,
        isActive: true,
      });
      console.log(`[Seed] Initial Admin created: ${admin.email}`);
    } else {
      console.log(`[Seed] Admin already exists: ${admin.email}`);
    }

    // 2. Seed Courses for 11th and 12th Commerce
    let course11 = await Course.findOne({ slug: '11-commerce' });
    if (!course11) {
      course11 = await Course.create({
        title: '11th Commerce Comprehensive Mastery',
        slug: '11-commerce',
        grade: '11th',
        stream: 'Commerce',
        description: 'Rigorous foundation in Accountancy, Economics, Business Studies and Applied Mathematics designed for CBSE and State Board excellence.',
        features: [
          'Conceptual depth in Financial Accounting',
          'Interactive Microeconomics and Statistics sessions',
          'Weekly revision worksheets and unit assessments',
          'Doubt-clearing workshops and personalized mentoring',
        ],
        durationMonths: 12,
        feeAmount: 35000,
        isActive: true,
      });
      console.log('[Seed] 11th Commerce Course seeded');
    }

    let course12 = await Course.findOne({ slug: '12-commerce' });
    if (!course12) {
      course12 = await Course.create({
        title: '12th Commerce Board & CUET Excellence',
        slug: '12-commerce',
        grade: '12th',
        stream: 'Commerce',
        description: 'Elite board preparation program covering Company Accounts, Macroeconomics, Business Management with full mock exam series.',
        features: [
          'Mastery over Partnership and Company Accounting',
          'Macroeconomics & Indian Economic Development case studies',
          'Past 10 years solved board papers and CUET orientation',
          'Timed full-syllabus mock tests with model answer evaluation',
        ],
        durationMonths: 12,
        feeAmount: 42000,
        isActive: true,
      });
      console.log('[Seed] 12th Commerce Course seeded');
    }

    // 3. Seed Subjects for 11th and 12th Commerce
    const subjectsSeed = [
      { name: 'Financial Accounting', code: 'ACC11', grade: '11th', course: course11._id, order: 1 },
      { name: 'Microeconomics & Statistics', code: 'ECO11', grade: '11th', course: course11._id, order: 2 },
      { name: 'Business Studies', code: 'BST11', grade: '11th', course: course11._id, order: 3 },
      { name: 'Corporate Accounting', code: 'ACC12', grade: '12th', course: course12._id, order: 1 },
      { name: 'Macroeconomics & Indian Economy', code: 'ECO12', grade: '12th', course: course12._id, order: 2 },
      { name: 'Business Management', code: 'BST12', grade: '12th', course: course12._id, order: 3 },
    ];

    for (const sub of subjectsSeed) {
      const exists = await Subject.findOne({ code: sub.code });
      if (!exists) {
        await Subject.create({
          ...sub,
          chapters: [
            { chapterNumber: 1, title: 'Introduction and Theoretical Framework' },
            { chapterNumber: 2, title: 'Core Principles & Recording Transactions' },
            { chapterNumber: 3, title: 'Advanced Analysis & Practice Problems' },
          ],
        });
      }
    }
    console.log('[Seed] Subjects seeded');

    // 4. Seed Batches
    let batch12Morning = await Batch.findOne({ code: '12C-MORN-26' });
    if (!batch12Morning) {
      batch12Morning = await Batch.create({
        name: '12th Commerce Morning Achievers',
        code: '12C-MORN-26',
        grade: '12th',
        course: course12._id,
        academicYear: '2026-2027',
        scheduleTime: '08:00 AM - 11:30 AM (Mon - Sat)',
        maxCapacity: 40,
        currentEnrollment: 1,
      });
    }

    let batch11Evening = await Batch.findOne({ code: '11C-EVE-26' });
    if (!batch11Evening) {
      batch11Evening = await Batch.create({
        name: '11th Commerce Evening Foundation',
        code: '11C-EVE-26',
        grade: '11th',
        course: course11._id,
        academicYear: '2026-2027',
        scheduleTime: '04:30 PM - 07:30 PM (Mon - Fri)',
        maxCapacity: 40,
        currentEnrollment: 1,
      });
    }
    console.log('[Seed] Batches seeded');

    // 5. Seed Demo Teachers
    const teachersSeed = [
      {
        name: 'Prof. Rajesh Sharma (CA)',
        email: 'teacher@apexcommerce.edu',
        password: 'Teacher@123',
        phone: '9820011223',
        employeeId: 'TCH001',
        qualification: 'FCA, M.Com (Finance)',
        specialization: ['Financial Accounting', 'Corporate Accounting', 'Auditing'],
        experienceYears: 14,
        bio: 'Senior commerce faculty and Fellow Chartered Accountant with 14+ years experience mentoring rankers in CBSE and state boards. Author of practical accounting guides.',
      },
      {
        name: 'Dr. Ananya Kulkarni',
        email: 'ananya.kulkarni@apexcommerce.edu',
        password: 'Teacher@123',
        phone: '9820011224',
        employeeId: 'TCH002',
        qualification: 'Ph.D. in Macroeconomics, M.Sc (Eco)',
        specialization: ['Microeconomics', 'Macroeconomics', 'Indian Economic Development'],
        experienceYears: 12,
        bio: 'Ph.D. in Macroeconomics with over a decade of teaching experience. Renowned for visual case studies and simplifying complex economic theories.',
      },
      {
        name: 'Prof. Vikram Pant',
        email: 'vikram.pant@apexcommerce.edu',
        password: 'Teacher@123',
        phone: '9820011225',
        employeeId: 'TCH003',
        qualification: 'MBA (Finance & Marketing), UGC-NET',
        specialization: ['Business Studies', 'Business Management', 'Applied Mathematics'],
        experienceYears: 10,
        bio: 'MBA graduate with 10+ years specializing in case study problem solving, commercial management, and CUET entrance prep.',
      },
    ];

    let primaryTeacherUser: any = null;

    for (const t of teachersSeed) {
      let tUser = await User.findOne({ email: t.email.toLowerCase() });
      if (!tUser) {
        tUser = await User.create({
          name: t.name,
          email: t.email.toLowerCase(),
          password: t.password,
          role: 'TEACHER',
          phone: t.phone,
          isActive: true,
        });

        await TeacherProfile.create({
          user: tUser._id,
          employeeId: t.employeeId,
          qualification: t.qualification,
          specialization: t.specialization,
          phone: t.phone,
          experienceYears: t.experienceYears,
          bio: t.bio,
        });
        console.log(`[Seed] Teacher created: ${t.email}`);
      }
      if (!primaryTeacherUser) {
        primaryTeacherUser = tUser;
      }
    }

    // Assign Primary Teacher to subjects and batch
    const acc12 = await Subject.findOne({ code: 'ACC12' });
    if (acc12 && batch12Morning && primaryTeacherUser) {
      await TeacherAssignment.findOneAndUpdate(
        { teacher: primaryTeacherUser._id, subject: acc12._id, batch: batch12Morning._id },
        { teacher: primaryTeacherUser._id, subject: acc12._id, batch: batch12Morning._id },
        { upsert: true }
      );
    }

    // 6. Seed Demo Student
    let studentUser = await User.findOne({ email: 'student@tuitionmgt.com' });
    if (!studentUser) {
      studentUser = await User.create({
        name: 'Aarav Patel',
        email: 'student@tuitionmgt.com',
        password: 'Student@123',
        role: 'STUDENT',
        phone: '9811223344',
        isActive: true,
      });

      await StudentProfile.create({
        user: studentUser._id,
        rollNo: 'C12260001',
        grade: '12th',
        stream: 'Commerce',
        parentName: 'Vikram Patel',
        parentPhone: '9811223340',
        parentEmail: 'vikram.patel@example.com',
        address: 'B-402, Sunrise Towers, Model Town',
        batch: batch12Morning._id,
      });

      await Enrollment.findOneAndUpdate(
        { student: studentUser._id, batch: batch12Morning._id },
        { student: studentUser._id, batch: batch12Morning._id, status: 'ACTIVE' },
        { upsert: true }
      );
      console.log('[Seed] Demo Student created: student@tuitionmgt.com / Student@123');
    }

    // 7. Seed Sample Announcements
    const announcementExists = await Announcement.countDocuments();
    if (announcementExists === 0) {
      await Announcement.create([
        {
          title: 'Welcome to Academic Year 2026-2027',
          content: 'Classes for 11th and 12th Commerce batches have commenced. Please check your timetable and download syllabus resources.',
          targetAudience: 'ALL',
          publishedBy: admin._id,
          priority: 'HIGH',
        },
        {
          title: 'Upcoming Accountancy Unit Test 1',
          content: 'Unit test on Partnership Basics will take place this Saturday. Comprehensive revision notes have been uploaded.',
          targetAudience: 'STUDENTS',
          grade: '12th',
          batch: batch12Morning._id,
          publishedBy: primaryTeacherUser._id,
          priority: 'NORMAL',
        },
      ]);
    }

    // 8. Seed Sample Study Material
    if (acc12 && batch12Morning) {
      const matExists = await StudyMaterial.countDocuments();
      if (matExists === 0) {
        await StudyMaterial.create({
          title: 'Partnership Fundamental Concepts & Goodwill Valuation',
          description: 'Detailed formula sheet and solved illustrations for CBSE 2027 boards.',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          fileName: 'Partnership_Concepts_Ch1.pdf',
          fileSize: 1024 * 750,
          mimeType: 'application/pdf',
          grade: '12th',
          subject: acc12._id,
          batch: batch12Morning._id,
          chapter: 'Chapter 1: Partnership Fundamentals',
          uploadedBy: primaryTeacherUser._id,
        });
      }

      // 9. Seed Sample Homework
      const hwExists = await Homework.countDocuments();
      if (hwExists === 0) {
        await Homework.create({
          title: 'Profit & Loss Appropriation Practice Problems',
          description: 'Solve questions 1 through 15 from the assignment sheet. Show complete workings and journal entries.',
          grade: '12th',
          subject: acc12._id,
          batch: batch12Morning._id,
          assignedBy: primaryTeacherUser._id,
          dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          totalMarks: 20,
        });
      }

      // 10. Seed Sample Online Test with Questions
      const testExists = await Test.countDocuments();
      if (testExists === 0) {
        await Test.create({
          title: 'Weekly Accounting Diagnostic Quiz',
          description: '20-minute multiple-choice test on Partnership fundamentals.',
          grade: '12th',
          subject: acc12._id,
          batch: batch12Morning._id,
          createdBy: primaryTeacherUser._id,
          durationMinutes: 20,
          totalMarks: 20,
          passingMarks: 8,
          scheduledDate: new Date(),
          status: 'PUBLISHED',
          questions: [
            {
              questionText: 'In the absence of a partnership deed, interest on capital is allowed at what rate?',
              options: ['6% per annum', '10% per annum', 'No interest is allowed', 'At the bank rate'],
              correctOptionIndex: 2,
              marks: 5,
              explanation: 'According to the Indian Partnership Act 1932, in the absence of a deed, no interest on capital is payable.',
            },
            {
              questionText: 'Partnership deed is also known as:',
              options: ['Articles of Partnership', 'Prospectus', 'Memorandum of Association', 'Certificate of Incorporation'],
              correctOptionIndex: 0,
              marks: 5,
              explanation: 'Partnership deed is also referred to as the Articles of Partnership.',
            },
            {
              questionText: 'Where does Interest on Drawings get credited in final accounts?',
              options: ['Profit & Loss Account', 'Profit & Loss Appropriation Account', 'Partners Capital Account', 'Balance Sheet'],
              correctOptionIndex: 1,
              marks: 5,
              explanation: 'Interest on drawings is an income for the firm and is credited to the P&L Appropriation Account.',
            },
            {
              questionText: 'Which method considers only past profits for goodwill valuation without time weightage?',
              options: ['Weighted Average Method', 'Super Profit Method', 'Simple Average Profit Method', 'Capitalization Method'],
              correctOptionIndex: 2,
              marks: 5,
              explanation: 'Simple Average Profit Method takes arithmetic mean of past years without assigning weights.',
            },
          ],
        });
      }
    }

    console.log('[Seed] Database seed completed successfully!');
  } catch (error) {
    console.error('[Seed] Database seed error:', error);
  }
};

// Run if called directly
if (process.argv[1]?.endsWith('seed.ts')) {
  seedData().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
