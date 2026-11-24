import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  FileText,
  ClipboardList,
  CheckSquare,
  BarChart2,
  Calendar,
  Bell,
  Mail,
  LogOut,
  Menu,
  X,
  UserCheck,
  Award,
  Settings,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    if (role === 'ADMIN') {
      navigate('/admin/login');
    } else {
      navigate('/login');
    }
  };

  // Build role-specific sidebar navigation
  let navItems: NavItem[] = [];

  if (role === 'ADMIN') {
    navItems = [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Students', path: '/admin/students', icon: GraduationCap },
      { name: 'Teachers', path: '/admin/teachers', icon: Users },
      { name: 'Batches', path: '/admin/batches', icon: Layers },
      { name: 'Courses & Syllabus', path: '/admin/courses', icon: BookOpen },
      { name: 'Study Materials', path: '/admin/materials', icon: FileText },
      { name: 'Homework', path: '/admin/homework', icon: ClipboardList },
      { name: 'Tests & Quizzes', path: '/admin/tests', icon: CheckSquare },
      { name: 'Attendance Records', path: '/admin/attendance', icon: UserCheck },
      { name: 'Announcements', path: '/admin/announcements', icon: Bell },
      { name: 'Admission Enquiries', path: '/admin/enquiries', icon: Mail },
      { name: 'Website & Settings', path: '/admin/settings', icon: Settings },
    ];
  } else if (role === 'TEACHER') {
    navItems = [
      { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
      { name: 'Mark Attendance', path: '/teacher/attendance', icon: UserCheck },
      { name: 'Study Materials', path: '/teacher/materials', icon: FileText },
      { name: 'Homework & Evaluation', path: '/teacher/homework', icon: ClipboardList },
      { name: 'Tests & Results', path: '/teacher/tests', icon: CheckSquare },
      { name: 'Announcements', path: '/teacher/announcements', icon: Bell },
      { name: 'Website Controls', path: '/teacher/settings', icon: Settings },
    ];
  } else if (role === 'STUDENT') {
    navItems = [
      { name: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
      { name: 'Study Materials', path: '/student/materials', icon: FileText },
      { name: 'Homework', path: '/student/homework', icon: ClipboardList },
      { name: 'Online Tests', path: '/student/tests', icon: CheckSquare },
      { name: 'Attendance', path: '/student/attendance', icon: UserCheck },
      { name: 'Timetable', path: '/student/timetable', icon: Calendar },
    ];
  }

  const getRoleBadge = () => {
    if (role === 'ADMIN') {
      return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-rose-100 text-rose-800 border border-rose-200">Admin</span>;
    }
    if (role === 'TEACHER') {
      return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">Faculty</span>;
    }
    return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">Student</span>;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-slate-900 block leading-tight text-sm sm:text-base">
                  Apex Commerce Academy
                </span>
                <span className="text-xs text-slate-500 font-medium">11th & 12th Commerce Portal</span>
              </div>
            </Link>
          </div>

          {/* User profile + Logout */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 text-right">
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 leading-none">{user?.name}</p>
                <div className="mt-1 flex items-center justify-end space-x-1.5">
                  {getRoleBadge()}
                  <span className="text-xs text-slate-400">{user?.email}</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-sm shadow">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 text-xs font-semibold transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main body: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
            sidebarOpen ? 'translate-x-0 top-16' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col justify-between py-6 px-4 overflow-y-auto">
            <div className="space-y-1">
              <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {role} Navigation
              </p>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <p className="text-xs font-medium text-slate-500">Academic Year</p>
                <p className="text-xs font-bold text-slate-800">2026 - 2027</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
