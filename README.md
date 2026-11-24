# Apex Commerce Academy -- Tuition Management System & LMS

A full-stack, responsive tuition center platform tailored for **11th and 12th Commerce** students, faculty, and administrative staff. Built according to [`tuition_center_development_plan.md`](./tuition_center_development_plan.md).

---

## 🚀 Technology Stack

- **Backend**: Node.js, Express.js, TypeScript, MongoDB (Mongoose ODM), JWT Authentication (Access + Refresh tokens with HttpOnly cookies), bcrypt, Zod validation, helmet, cors, rate limiting.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router v7, React Hook Form, Axios.

---

## 🌐 Application Architecture & Portals

### 1. Public Website
- `/` -- Landing page featuring commerce highlights, achievements, and statistics
- `/about` -- Academy story, mission, and faculty mentors
- `/courses` -- Academic program comparisons
- `/courses/11-commerce` -- 11th Commerce syllabus & module breakdown
- `/courses/12-commerce` -- 12th Commerce board & CUET prep details
- `/admission` -- Interactive admission enquiry form (connected to backend)
- `/contact` -- Center location, contact details & WhatsApp support

### 2. Student & Teacher Portal (`/login`)
Shared login portal that inspects user roles and redirects accordingly:
- **Teacher Dashboard** (`/teacher/*`):
  - Assigned cohorts overview
  - Mark daily attendance with one-click toggles
  - Distribute lecture notes & chapter study materials
  - Assign homework tasks & grade submissions
  - Create online quizzes & inspect diagnostics
  - Publish cohort announcements
- **Student Dashboard** (`/student/*`):
  - Attendance tracker & exam eligibility status (≥ 75%)
  - Download chapter notes, PDFs & formula sheets
  - Homework viewer & file submission
  - Interactive multiple-choice tests with real-time scoring
  - Weekly class timetable & classroom allocations

### 3. Dedicated Admin Portal (`/admin/login`)
Isolated administrative login URL restricted strictly to `ADMIN` accounts:
- Metric analytics (students, faculty, batches, courses, inquiries)
- Student directory & enrollment management
- Teacher directory & batch assignments
- Batch management with capacity tracking
- Course syllabus & chapter management
- Lead pipeline (Admission enquiries with status workflow: `NEW` ➔ `CONTACTED` ➔ `CONVERTED`)
- Academy-wide broadcast notices

---

## 🔑 Demo Login Accounts

| Role | Portal URL | Email | Password |
|---|---|---|---|
| **Admin** | [`/admin/login`](http://localhost:5173/admin/login) | `admin@tuitionmgt.com` | `Admin@123456` |
| **Faculty (Teacher)** | [`/login`](http://localhost:5173/login) | `teacher@tuitionmgt.com` | `Teacher@123` |
| **Student** | [`/login`](http://localhost:5173/login) | `student@tuitionmgt.com` | `Student@123` |

*Note: Both login screens include single-click "Autofill" buttons for rapid testing.*

---

## 🛠️ How to Run

### 1. Start Backend API
```bash
cd backend
pnpm install
pnpm dev
```
Backend API will start on `http://localhost:5000` (Health check at `http://localhost:5000/api/health`). On startup, it automatically seeds initial admin, courses, subjects, batches, demo faculty, and demo student records.

### 2. Start Frontend App
```bash
cd frontend
pnpm install
pnpm dev
```
Open `http://localhost:5173` in your browser.
