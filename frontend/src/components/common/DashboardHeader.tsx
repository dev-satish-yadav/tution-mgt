import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { BookOpen, LogOut, Menu, X } from 'lucide-react';

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { user, role, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    if (role === 'ADMIN') {
      navigate('/admin/login');
    } else {
      navigate('/login');
    }
  };

  const getRoleBadge = () => {
    if (role === 'ADMIN') {
      return (
        <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-rose-100 text-rose-800 border border-rose-200">
          Admin
        </span>
      );
    }
    if (role === 'TEACHER') {
      return (
        <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">
          Faculty
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">
        Student
      </span>
    );
  };

  return (
    <header className="h-16 flex-shrink-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo & Institute Name */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs group-hover:bg-indigo-700 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-900 block leading-tight text-sm sm:text-base">
                {settings.instituteName || 'Tuition Academy'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {settings.tagline || 'Education & Coaching Portal'}
              </span>
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
  );
};
