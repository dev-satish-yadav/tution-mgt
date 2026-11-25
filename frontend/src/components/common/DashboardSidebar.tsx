import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  FileText,
  CheckSquare,
  Calendar,
  Bell,
  Mail,
  UserCheck,
  Settings,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { role } = useAuth();
  const location = useLocation();

  // Role-specific navigation items
  let navItems: NavItem[] = [];

  if (role === 'ADMIN') {
    navItems = [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Students', path: '/admin/students', icon: GraduationCap },
      { name: 'Teachers', path: '/admin/teachers', icon: Users },
      { name: 'Standards & Streams', path: '/admin/standards', icon: Layers },
      { name: 'Subjects', path: '/admin/subjects', icon: BookOpen },
      { name: 'Batches', path: '/admin/batches', icon: Calendar },
      { name: 'Study Materials', path: '/admin/materials', icon: FileText },
      { name: 'Tests & Quizzes', path: '/admin/tests', icon: CheckSquare },
      { name: 'Attendance Records', path: '/admin/attendance', icon: UserCheck },
      { name: 'Announcements', path: '/admin/announcements', icon: Bell },
      { name: 'Admission Enquiries', path: '/admin/enquiries', icon: Mail },
      { name: 'Website & Settings', path: '/admin/settings', icon: Settings },
    ];
  } else if (role === 'TEACHER') {
    navItems = [
      { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
      { name: 'Students', path: '/teacher/students', icon: GraduationCap },
      { name: 'Subjects', path: '/teacher/subjects', icon: BookOpen },
      { name: 'Mark Attendance', path: '/teacher/attendance', icon: UserCheck },
      { name: 'Study Materials', path: '/teacher/materials', icon: FileText },
      { name: 'Tests & Results', path: '/teacher/tests', icon: CheckSquare },
      { name: 'Announcements', path: '/teacher/announcements', icon: Bell },
    ];
  } else if (role === 'STUDENT') {
    navItems = [
      { name: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
      { name: 'Study Materials', path: '/student/materials', icon: FileText },
      { name: 'Online Tests', path: '/student/tests', icon: CheckSquare },
      { name: 'Attendance', path: '/student/attendance', icon: UserCheck },
      { name: 'Timetable', path: '/student/timetable', icon: Calendar },
    ];
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 top-16 z-20 bg-slate-900/30 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Pinned Navigation Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-full lg:flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col justify-between py-5 px-3.5 overflow-y-auto">
          {/* Nav Links */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
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
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Academic Session Footer */}
          <div className="pt-4 mt-6 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <p className="text-[11px] font-medium text-slate-500">Academic Year</p>
              <p className="text-xs font-bold text-slate-800">2026 - 2027</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
