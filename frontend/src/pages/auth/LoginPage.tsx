import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, LogIn, GraduationCap, Users, ShieldAlert, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      // Portal type 'portal' prevents admins from logging in through the shared login
      const result = await login(data.email, data.password, 'portal');

      // Redirect according to user role
      if (result.user.role === 'TEACHER') {
        navigate('/teacher/dashboard', { replace: true });
      } else if (result.user.role === 'STUDENT') {
        navigate('/student/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoStudent = () => {
    setValue('email', 'student@tuitionmgt.com');
    setValue('password', 'Student@123');
    setErrorMessage('');
  };

  const handleDemoTeacher = () => {
    setValue('email', 'teacher@tuitionmgt.com');
    setValue('password', 'Teacher@123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <BookOpen className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">Portal Sign In</h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Sign in to access your course materials, homework, and performance.
          </p>
        </div>

        {/* Demo Fast-Login Pill Buttons */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2.5">
          <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider text-center">
            Quick Demo Autofill
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoStudent}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 text-xs font-semibold border border-indigo-200 shadow-xs transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Demo Student</span>
            </button>
            <button
              type="button"
              onClick={handleDemoTeacher}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-amber-700 text-xs font-semibold border border-amber-200 shadow-xs transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Demo Faculty</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-rose-700 text-xs">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-70 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Are you an administrator?</span>
            <Link to="/admin/login" className="font-semibold text-indigo-600 hover:text-indigo-800">
              Admin Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
