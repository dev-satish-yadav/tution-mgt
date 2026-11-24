import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Calendar,
  CheckSquare,
  ClipboardList,
  UserCheck,
  Bell,
  ArrowRight,
  Download,
  Clock,
  Sparkles,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDash = async () => {
      try {
        const response = await api.get('/dashboard/student');
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load student dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDash();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading your student workspace...</div>;
  }

  const profile = data?.profile;
  const stats = data?.stats || {};
  const pendingHomework = data?.pendingHomework || [];
  const upcomingTests = data?.upcomingTests || [];
  const announcements = data?.announcements || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>{profile?.grade || '12th'} Commerce • Roll No: {profile?.rollNo || 'Pending'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            Batch: <span className="font-semibold text-white">{profile?.batch?.name || 'Assigned Cohort'}</span> ({profile?.batch?.scheduleTime})
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/student/tests"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-indigo-50 transition-colors shadow"
          >
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            <span>Attempt Tests</span>
          </Link>
          <Link
            to="/student/materials"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white border border-indigo-500/30 font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Study Notes</span>
          </Link>
        </div>
      </div>

      {/* Quick Academic Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Attendance</span>
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.attendanceRate || 100}%</p>
          <p className="text-xs text-slate-400">
            {stats.presentClasses || 0} / {stats.totalClasses || 0} Sessions
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Homework</span>
            <ClipboardList className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.pendingHomeworkCount || 0}</p>
          <p className="text-xs text-slate-400">Assignments Due</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Scheduled Tests</span>
            <CheckSquare className="w-5 h-5 text-violet-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.upcomingTestsCount || 0}</p>
          <p className="text-xs text-slate-400">Diagnostic Quizzes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Academic Year</span>
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">2026-27</p>
          <p className="text-xs text-slate-400">Board Session</p>
        </div>
      </div>

      {/* Two Column Layout: Homework & Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending Homework */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Active Homework Tasks</h2>
              <p className="text-xs text-slate-500">Assignments to submit for teacher feedback</p>
            </div>
            <Link
              to="/student/homework"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingHomework.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">No pending homework due this week.</div>
          ) : (
            <div className="space-y-3">
              {pendingHomework.map((hw: any) => (
                <div key={hw._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold">
                      {hw.subject?.name}
                    </span>
                    <span className="text-slate-500 font-medium flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Due: {new Date(hw.dueDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{hw.title}</h3>
                  <p className="text-slate-600 line-clamp-1">{hw.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Upcoming Tests & Notice Board */}
        <div className="lg:col-span-6 space-y-6">
          {/* Upcoming Tests */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Online Practice Tests</h2>
                <p className="text-xs text-slate-500">Multiple-choice quizzes available for practice</p>
              </div>
              <Link
                to="/student/tests"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <span>Take Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {upcomingTests.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">No tests scheduled currently.</div>
            ) : (
              <div className="space-y-3">
                {upcomingTests.map((t: any) => (
                  <div key={t._id} className="p-3.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">{t.title}</span>
                      <span className="text-slate-500">{t.subject?.name} • Duration: {t.durationMinutes}m</span>
                    </div>
                    <Link
                      to="/student/tests"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors"
                    >
                      Attempt
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Announcements */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 text-slate-900 font-bold text-base">
              <Bell className="w-4 h-4 text-indigo-600" />
              <h2>Notice Board</h2>
            </div>

            {announcements.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400">No announcements posted.</div>
            ) : (
              <div className="space-y-3">
                {announcements.map((ann: any) => (
                  <div key={ann._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                    <p className="font-bold text-slate-900">{ann.title}</p>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{ann.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
