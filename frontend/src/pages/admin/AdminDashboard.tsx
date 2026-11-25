import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios';
import { useSettings } from '../../context/SettingsContext';
import {
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  Mail,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { settings } = useSettings();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard/admin');
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading academy analytics...</div>;
  }

  const stats = data?.stats || {};
  const recentEnquiries = data?.recentEnquiries || [];
  const distribution = data?.distribution || [];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            Administration Central
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Academic Overview & Controls</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time management for {settings.instituteName || 'academy'} students, faculty, batches, and enquiries.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/students"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Student</span>
          </Link>
          <Link
            to="/admin/batches"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>Manage Batches</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Students</span>
            <GraduationCap className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalStudents || 0}</p>
          <p className="text-xs text-slate-400">Total Enrolled</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Faculty</span>
            <Users className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalTeachers || 0}</p>
          <p className="text-xs text-slate-400">Active Teachers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Batches</span>
            <Layers className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalBatches || 0}</p>
          <p className="text-xs text-slate-400">Active Sessions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Courses</span>
            <BookOpen className="w-5 h-5 text-violet-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalCourses || 0}</p>
          <p className="text-xs text-slate-400">11th & 12th</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Enquiries</span>
            <Mail className="w-5 h-5 text-rose-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalEnquiries || 0}</p>
            {stats.newEnquiriesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                {stats.newEnquiriesCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">Lead Pipeline</p>
        </div>
      </div>

      {/* Two Column Layout: Enrolment Distribution + Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Enrollment Distribution */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Student Grade Breakdown</h2>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {distribution.map((dist: any) => (
              <div key={dist.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-800">
                  <span>{dist.name}</span>
                  <span className="text-indigo-600 font-bold">{dist.value} Students</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.totalStudents > 0 ? Math.round((dist.value / stats.totalStudents) * 100) : 50
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100/60 text-xs text-indigo-900 space-y-1">
            <p className="font-bold">Academic Capacity Insight</p>
            <p className="text-indigo-700">
              Morning and evening batches maintain an average occupancy of 85%. Additional batch slots can be opened in
              the Batches module.
            </p>
          </div>
        </div>

        {/* Right: Recent Admission Enquiries */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Admission Enquiries</h2>
              <p className="text-xs text-slate-500">Incoming inquiries from the public website admission form</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">No enquiries submitted yet.</div>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map((enq: any) => (
                <div
                  key={enq._id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center justify-between transition-colors text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{enq.fullName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-semibold text-xs">
                        {enq.grade}
                      </span>
                    </div>
                    <div className="text-slate-500 flex items-center space-x-3">
                      <span>{enq.phone}</span>
                      <span>•</span>
                      <span>{enq.email}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                      enq.status === 'NEW'
                        ? 'bg-rose-100 text-rose-700'
                        : enq.status === 'CONTACTED'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
