# Tuition Center Website -- Simple Development Plan

## 1. Project Overview

Build a responsive tuition center website and learning management
platform for **11th and 12th Commerce students**.

The application will have three main areas:

1.  **Public Website** -- Visitors can learn about the tuition center,
    view courses and submit admission enquiries.
2.  **Student & Teacher Portal** -- Students and teachers use the same
    login page. Their role determines which dashboard opens.
3.  **Admin Portal** -- Admin uses a separate login URL and manages the
    entire platform.

## 2. Technology Stack

  Area                Technology
  ------------------- ------------------------------------------------------
  Frontend            React.js + TypeScript
  Build tool          Vite
  Styling             Tailwind CSS
  UI components       shadcn/ui or a consistent reusable component library
  Routing             React Router
  Forms               React Hook Form + Zod
  API communication   Axios
  Backend             Node.js + Express.js + TypeScript
  Database            MongoDB
  ODM                 Mongoose
  Authentication      JWT access token + refresh token
  Password security   bcrypt
  File storage        Cloudinary or AWS S3
  Charts              Recharts
  API documentation   Swagger / OpenAPI
  Testing             Jest or Vitest, Supertest, Playwright
  Version control     Git + GitHub

## 3. URL and Application Structure

### Public website

-   `/` -- Home / landing page
-   `/about` -- About the tuition center
-   `/courses` -- Available courses
-   `/courses/11-commerce` -- 11th Commerce details
-   `/courses/12-commerce` -- 12th Commerce details
-   `/admission` -- Admission enquiry form
-   `/contact` -- Contact information

### Student and teacher portal

-   `/login` -- Shared login page
-   `/student/dashboard`
-   `/student/subjects`
-   `/student/study-materials`
-   `/student/homework`
-   `/student/tests`
-   `/student/results`
-   `/student/attendance`
-   `/student/timetable`
-   `/student/announcements`
-   `/student/profile`
-   `/teacher/dashboard`
-   `/teacher/students`
-   `/teacher/subjects`
-   `/teacher/attendance`
-   `/teacher/study-materials`
-   `/teacher/homework`
-   `/teacher/tests`
-   `/teacher/results`
-   `/teacher/announcements`
-   `/teacher/profile`

### Admin portal

-   `/admin/login` -- Separate admin login
-   `/admin/dashboard`
-   `/admin/students`
-   `/admin/teachers`
-   `/admin/courses`
-   `/admin/subjects`
-   `/admin/batches`
-   `/admin/enrollments`
-   `/admin/study-materials`
-   `/admin/homework`
-   `/admin/tests`
-   `/admin/results`
-   `/admin/attendance`
-   `/admin/announcements`
-   `/admin/enquiries`
-   `/admin/reports`
-   `/admin/website`
-   `/admin/settings`

The admin login must only authenticate accounts with the `ADMIN` role.
The shared login must only authenticate `STUDENT` and `TEACHER`
accounts.

## 4. Features to Develop

### Phase 1 -- Project Setup and Authentication

-   Set up React frontend and Express backend using TypeScript.
-   Configure MongoDB and Mongoose.
-   Create common API response and error-handling conventions.
-   Implement login, logout and token refresh.
-   Implement roles: `ADMIN`, `TEACHER`, `STUDENT`.
-   Add protected frontend routes and backend authorization middleware.
-   Admin creates student and teacher accounts; no public account
    registration in the first version.

### Phase 2 -- Public Website

-   Responsive landing page.
-   About tuition center.
-   11th and 12th Commerce course pages.
-   Subject information.
-   Why choose us section.
-   Student achievements and testimonials.
-   Gallery.
-   Contact details and WhatsApp link.
-   Admission enquiry form.

### Phase 3 -- Admin Dashboard

-   Dashboard statistics.
-   Create, edit, view and deactivate student accounts.
-   Create, edit, view and deactivate teacher accounts.
-   Manage courses and subjects.
-   Create batches.
-   Assign teachers to subjects and batches.
-   Enroll students in batches.
-   Manage study materials, homework, tests and results.
-   View attendance.
-   Manage admission enquiries and announcements.
-   Manage public website content.
-   View reports.

### Phase 4 -- Teacher Dashboard

-   View assigned batches, subjects and students.
-   Mark and review attendance.
-   Upload study materials and notes.
-   Create homework and assignments.
-   Review student submissions and provide feedback.
-   Create tests and questions.
-   Evaluate written answers.
-   Publish marks and results where authorized.
-   Publish announcements for assigned students.

### Phase 5 -- Student Dashboard

-   View personal profile and enrolled subjects.
-   View subject and chapter information.
-   Access and download study materials.
-   View homework and submit files.
-   View available tests and attempt them.
-   View test results and performance.
-   View attendance history.
-   View class timetable.
-   Read announcements.

### Phase 6 -- Testing and Deployment

-   Test authentication and role permissions.
-   Test that students can access only their own data.
-   Test that teachers can access only assigned batches and subjects.
-   Validate forms and API inputs.
-   Test file upload restrictions.
-   Test responsive layouts on mobile, tablet and desktop.
-   Add logging, backups and production environment configuration.
-   Deploy frontend, backend and MongoDB using suitable hosting.

## 5. Backend Modules

Organize the Express backend into feature-based modules:

``` text
backend/src/
├── config/
├── common/
│   ├── middleware/
│   ├── validators/
│   ├── errors/
│   └── utils/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── students/
│   ├── teachers/
│   ├── courses/
│   ├── subjects/
│   ├── batches/
│   ├── enrollments/
│   ├── assignments/
│   ├── materials/
│   ├── homework/
│   ├── submissions/
│   ├── tests/
│   ├── results/
│   ├── attendance/
│   ├── timetable/
│   ├── announcements/
│   ├── enquiries/
│   ├── website/
│   ├── dashboard/
│   └── reports/
├── app.ts
└── server.ts
```

Each module should contain its routes, controller, service, model and
validation schemas where applicable.

## 6. MongoDB Collections

Use Mongoose models and references between related documents.

  Collection             Purpose
  ---------------------- -------------------------------------------------
  `users`                Login credentials, role and account status
  `studentProfiles`      Student details and parent contact information
  `teacherProfiles`      Teacher details
  `courses`              11th and 12th Commerce courses
  `subjects`             Accountancy, Economics, Statistics, etc.
  `chapters`             Chapters under each subject
  `batches`              Class batches and schedules
  `teacherAssignments`   Teacher-to-subject and batch assignments
  `enrollments`          Student-to-batch enrollment
  `studyMaterials`       Notes, PDFs and learning resources
  `homework`             Homework and assignment details
  `submissions`          Student homework submissions and feedback
  `tests`                Test details and settings
  `questions`            Test questions and answer options
  `testAttempts`         Student answers, attempts and scores
  `results`              Published exam results and marks
  `attendance`           Student attendance records
  `timetables`           Batch class schedules
  `announcements`        Notices and announcements
  `enquiries`            Public admission enquiries
  `websiteContents`      Editable public website sections
  `refreshTokens`        Hashed refresh-token records or session records

Add appropriate indexes, unique constraints and timestamps. Use MongoDB
references for relationships and avoid storing unnecessary duplicate
data.

## 7. Main API Groups

Use a versioned API prefix: `/api/v1`.

  ---------------------------------------------------------------------------------
  API group               Example endpoints                 Access
  ----------------------- --------------------------------- -----------------------
  Authentication          `POST /auth/login`,               Public / authenticated
                          `POST /auth/refresh`,             
                          `POST /auth/logout`,              
                          `GET /auth/me`                    

  Users                   `GET /users`,                     Admin
                          `PATCH /users/:id/status`         

  Students                `GET /students`,                  Admin; limited teacher
                          `POST /students`,                 access
                          `GET /students/:id`,              
                          `PATCH /students/:id`             

  Teachers                `GET /teachers`,                  Admin
                          `POST /teachers`,                 
                          `PATCH /teachers/:id`             

  Courses                 `GET /courses`, `POST /courses`,  Public read; admin
                          `PATCH /courses/:id`              write

  Subjects                `GET /subjects`, `POST /subjects` Public read; admin
                                                            write

  Batches                 `GET /batches`, `POST /batches`,  Role-restricted
                          `PATCH /batches/:id`              

  Enrollments             `POST /enrollments`,              Admin
                          `GET /enrollments`                

  Materials               `GET /materials`,                 Role-restricted
                          `POST /materials`,                
                          `DELETE /materials/:id`           

  Homework                `GET /homework`,                  Role-restricted
                          `POST /homework`,                 
                          `GET /homework/:id`               

  Submissions             `POST /submissions`,              Student / assigned
                          `GET /homework/:id/submissions`   teacher

  Tests                   `GET /tests`, `POST /tests`,      Role-restricted
                          `GET /tests/:id`                  

  Test attempts           `POST /tests/:id/attempts`,       Student
                          `POST /attempts/:id/submit`       

  Results                 `GET /results`,                   Role-restricted
                          `POST /results/:id/publish`       

  Attendance              `GET /attendance`,                Role-restricted
                          `POST /attendance`,               
                          `PATCH /attendance/:id`           

  Timetable               `GET /timetable`,                 Role-restricted
                          `POST /timetable`                 

  Announcements           `GET /announcements`,             Role-restricted
                          `POST /announcements`             

  Enquiries               `POST /enquiries`,                Public create; admin
                          `GET /enquiries`,                 manage
                          `PATCH /enquiries/:id`            

  Dashboard               `GET /dashboard/admin`,           Matching role
                          `/dashboard/teacher`,             
                          `/dashboard/student`              
  ---------------------------------------------------------------------------------

All write operations must validate request bodies. List endpoints should
support pagination, filtering and sorting.

## 8. Role-Based Access Rules

  Feature                         Admin   Teacher               Student
  ------------------------------- ------- --------------------- -------------------
  Create student accounts         Yes     No                    No
  Create teacher accounts         Yes     No                    No
  Manage courses and subjects     Yes     No                    No
  Manage batches and enrollment   Yes     Assigned scope only   No
  View students                   All     Assigned students     Own profile
  Upload study materials          All     Assigned subjects     No
  View study materials            All     Assigned subjects     Enrolled subjects
  Create homework                 All     Assigned batches      No
  Submit homework                 No      No                    Own submissions
  Create tests                    All     Assigned batches      No
  Attempt tests                   No      No                    Own attempts
  Mark attendance                 All     Assigned batches      No
  View attendance                 All     Assigned batches      Own records
  Manage website content          Yes     No                    No

**Security rule:** Frontend route protection is only for navigation and
user experience. Every API must independently verify authentication,
role and resource ownership/assignment. Never trust a user ID, role or
batch ID supplied by the client without checking authorization.

## 9. Important Implementation Rules

1.  Use TypeScript in both frontend and backend.
2.  Keep frontend components reusable and feature-based.
3.  Keep controllers thin; put business logic in services.
4.  Validate API inputs using Zod or express-validator.
5.  Hash passwords using bcrypt or Argon2.
6.  Store refresh tokens securely and rotate them.
7.  Prefer secure, HTTP-only cookies for browser authentication.
8.  Never store passwords or plain refresh tokens in MongoDB.
9.  Restrict file type and file size for uploads.
10. Do not expose private study material through public file URLs.
11. Add pagination to student, teacher, material and result listings.
12. Add audit logs for important admin actions.
13. Use environment variables for secrets and connection strings.
14. Seed the first admin account through a secure setup script; never
    allow public admin registration.
15. Use database backups and test restore procedures.

## 10. Suggested Delivery Order

  -----------------------------------------------------------------------
  Order                   Deliverable             Priority
  ----------------------- ----------------------- -----------------------
  1                       Project setup, MongoDB  Critical
                          connection and shared   
                          configuration           

  2                       Authentication, roles   Critical
                          and protected routes    

  3                       Public website and      High
                          admission enquiries     

  4                       Admin dashboard and     Critical
                          account management      

  5                       Courses, subjects,      Critical
                          batches and enrollment  

  6                       Teacher dashboard and   High
                          assignments             

  7                       Student dashboard and   High
                          study materials         

  8                       Homework and            High
                          submissions             

  9                       Tests, attempts and     High
                          results                 

  10                      Attendance, timetable   High
                          and announcements       

  11                      Reports, responsive     High
                          polish and testing      

  12                      Production deployment   Critical
                          and backups             
  -----------------------------------------------------------------------

## 11. Definition of Done

The first production-ready version should satisfy these checks:

-   Visitors can browse the public website and submit admission
    enquiries.
-   Admin can log in only through `/admin/login`.
-   Admin can create student and teacher accounts.
-   Students and teachers can log in through `/login`.
-   Users are redirected to the correct role dashboard.
-   Students cannot access teacher or admin APIs.
-   Teachers cannot access unassigned students or batches.
-   Students can access only their own academic records.
-   Teachers can manage their assigned academic activities.
-   Admin can manage the entire tuition center.
-   The website works on mobile, tablet and desktop.
-   Important flows have automated tests.

------------------------------------------------------------------------

**Recommended first milestone:** Complete authentication, role-based
authorization, admin account creation, course/subject management and
batch enrollment before starting the advanced learning features. This
creates the foundation for the rest of the platform.
