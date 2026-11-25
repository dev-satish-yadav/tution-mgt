import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DashboardLayout } from './components/common/DashboardLayout';

// Public pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { AdmissionPage } from './pages/public/AdmissionPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminTeachers } from './pages/admin/AdminTeachers';
import { AdminBatches } from './pages/admin/AdminBatches';
import { AdminStandards } from './pages/admin/AdminStandards';
import { AdminSubjects } from './pages/admin/AdminSubjects';
import { AdminMaterials } from './pages/admin/AdminMaterials';
import { AdminTests } from './pages/admin/AdminTests';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminSettings } from './pages/admin/AdminSettings';

// Teacher pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherAttendance } from './pages/teacher/TeacherAttendance';

// Student pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentMaterials } from './pages/student/StudentMaterials';
import { StudentTests } from './pages/student/StudentTests';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentTimetable } from './pages/student/StudentTimetable';

// Layout wrapper for Public Website
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/admission" element={<PublicLayout><AdmissionPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

            {/* Authentication Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="students" element={<AdminStudents />} />
                      <Route path="teachers" element={<AdminTeachers />} />
                      <Route path="batches" element={<AdminBatches />} />
                      <Route path="standards" element={<AdminStandards />} />
                      <Route path="subjects" element={<AdminSubjects />} />
                      <Route path="materials" element={<AdminMaterials />} />
                      <Route path="study-materials" element={<AdminMaterials />} />
                      <Route path="tests" element={<AdminTests />} />
                      <Route path="attendance" element={<AdminAttendance />} />
                      <Route path="announcements" element={<AdminAnnouncements />} />
                      <Route path="enquiries" element={<AdminEnquiries />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Teacher Protected Routes */}
            <Route
              path="/teacher/*"
              element={
                <ProtectedRoute allowedRoles={['TEACHER']}>
                  <DashboardLayout>
                    <Routes>
                      <Route path="dashboard" element={<TeacherDashboard />} />
                      <Route path="students" element={<AdminStudents />} />
                      <Route path="subjects" element={<AdminSubjects />} />
                      <Route path="attendance" element={<TeacherAttendance />} />
                      <Route path="materials" element={<AdminMaterials />} />
                      <Route path="study-materials" element={<AdminMaterials />} />
                      <Route path="tests" element={<AdminTests />} />
                      <Route path="announcements" element={<AdminAnnouncements />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Student Protected Routes */}
            <Route
              path="/student/*"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <DashboardLayout>
                    <Routes>
                      <Route path="dashboard" element={<StudentDashboard />} />
                      <Route path="materials" element={<StudentMaterials />} />
                      <Route path="study-materials" element={<StudentMaterials />} />
                      <Route path="tests" element={<StudentTests />} />
                      <Route path="attendance" element={<StudentAttendance />} />
                      <Route path="timetable" element={<StudentTimetable />} />
                      <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
