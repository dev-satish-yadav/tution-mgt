import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
  GraduationCap,
  ClipboardList,
  CheckSquare,
  UserCheck,
  Plus,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherDash = async () => {
      try {
        const response = await api.get('/dashboard/teacher');
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load teacher dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherDash();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading faculty workspace...</div>;
  }

  const stats = data?.stats || {};
  const assignments = data?.assignments || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
            Faculty Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100">
            Manage your assigned batches, student attendance, homework evaluation, and diagnostic tests.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/teacher/attendance"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white text-amber-900 font-semibold text-xs hover:bg-slate-100 transition-colors shadow"
          >
            <UserCheck className="w-4 h-4 text-amber-700" />
            <span>Mark Attendance</span>
          </Link>
          <Link
            to="/teacher/homework"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-900/60 hover:bg-amber-900/80 text-white border border-amber-400/30 font-semibold text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Homework</span>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Assigned Batches</span>
            <Layers className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.assignedBatchesCount || 0}</p>
          <p className="text-xs text-slate-400">Class Cohorts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Students Under Care</span>
            <GraduationCap className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalStudentsCount || 0}</p>
          <p className="text-xs text-slate-400">Total Enrolled</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Homework</span>
            <ClipboardList className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.activeHomeworkCount || 0}</p>
          <p className="text-xs text-slate-400">Assignments Due</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Tests</span>
            <CheckSquare className="w-5 h-5 text-violet-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.upcomingTestsCount || 0}</p>
          <p className="text-xs text-slate-400">Quizzes Published</p>
        </div>
      </div>

      {/* Assigned Batches and Subjects */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Teaching Assignments</h2>
            <p className="text-xs text-slate-500">Batches and courses you are assigned to instruct</p>
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No batches assigned yet. Contact the Administrator to assign you to a subject cohort.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((assign: any) => (
              <div key={assign._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-start justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                    {assign.batch?.grade} Standard
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{assign.subject?.code}</span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{assign.batch?.name}</h3>
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">{assign.subject?.name}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-500">
                  <p>Schedule: {assign.batch?.scheduleTime}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
