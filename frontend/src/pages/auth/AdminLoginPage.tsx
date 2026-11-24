import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, LogIn, ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

const adminLoginSchema = z.object({
  email: z.string().email('Please enter admin email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      // portal: 'admin' ensures only ADMIN role can authenticate
      await login(data.email, data.password, 'admin');
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Authentication failed. Please verify admin credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAdmin = () => {
    setValue('email', 'admin@tuitionmgt.com');
    setValue('password', 'Admin@123456');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-xl mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Admin Management Portal</h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Restricted area. Authorized academic administration only.
          </p>
        </div>

        {/* Demo Fast Autofill */}
        <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Demo Admin Credentials</span>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Autofill Admin</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">admin@tuitionmgt.com / Admin@123456</p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/90 p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 flex items-start space-x-2 text-rose-300 text-xs">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="admin@tuitionmgt.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-white placeholder-slate-500"
              />
              {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-white placeholder-slate-500"
              />
              {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-70 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating Admin...' : 'Authenticate as Admin'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
            <Link to="/" className="inline-flex items-center space-x-1 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </Link>
            <Link to="/login" className="hover:text-indigo-400 transition-colors">
              Student / Teacher Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
