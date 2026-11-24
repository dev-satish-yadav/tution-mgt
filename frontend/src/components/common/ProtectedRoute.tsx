import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // If route requires ADMIN role, redirect to admin login
    if (allowedRoles?.includes('ADMIN') && allowedRoles.length === 1) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Role mismatch: redirect to their respective home dashboard
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'TEACHER') return <Navigate to="/teacher/dashboard" replace />;
    if (role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
