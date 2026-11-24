import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { BookOpen, LogIn, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();

  // Dynamic Navigation Items based on feature flags enabled by Admin/Teacher
  const navLinks = [
    { name: 'Home', path: '/', visible: true },
    { name: 'About Us', path: '/about', visible: true },
    { name: 'Courses', path: '/courses', visible: settings.showCourses },
    { name: '11th Commerce', path: '/courses/11-commerce', visible: settings.showGrade11 },
    { name: '12th Commerce', path: '/courses/12-commerce', visible: settings.showGrade12 },
    { name: 'Admissions', path: '/admission', visible: settings.showAdmissions },
    { name: 'Contact', path: '/contact', visible: true },
  ].filter((item) => item.visible);

  const getDashboardLink = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'TEACHER') return '/teacher/dashboard';
    return '/student/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Dynamic Name & Tagline */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                {settings.instituteShortName || 'Apex Commerce'}
              </span>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
                {settings.tagline || '11th & 12th Academy'}
              </span>
            </div>
          </Link>

          {/* Right-aligned Navigation & CTA Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Desktop Navigation Menu Tabs */}
            <nav className="flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200" />

            {/* Auth Actions */}
            <div className="flex items-center space-x-3">
              {user ? (
                <Link
                  to={getDashboardLink()}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 shadow-sm transition-all"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-slate-100 font-medium text-sm transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-slate-500" />
                    <span>Login</span>
                  </Link>

                  <Link
                    to="/admin/login"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 font-medium text-xs transition-colors"
                    title="Administrative Staff Login"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Admin</span>
                  </Link>

                  {/* Only display Enroll Now CTA if admissions option is enabled */}
                  {settings.showAdmissions && (
                    <Link
                      to="/admission"
                      className="inline-flex items-center px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
                    >
                      Enroll Now
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            {user ? (
              <Link
                to={getDashboardLink()}
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-xl text-xs text-slate-500 font-medium hover:text-slate-800"
                >
                  Admin Portal Login
                </Link>
                {settings.showAdmissions && (
                  <Link
                    to="/admission"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
                  >
                    Enquire for Admission
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
