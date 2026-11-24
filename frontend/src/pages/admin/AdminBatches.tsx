import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { Batch, Course } from '../../types';
import { Layers, Plus, Clock, Users, X, CheckCircle2 } from 'lucide-react';

export const AdminBatches: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    grade: '12th',
    courseId: '',
    academicYear: '2026-2027',
    scheduleTime: '08:00 AM - 11:30 AM (Mon - Sat)',
    maxCapacity: 40,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await api.get('/batches');
      if (response.data.success) {
        setBatches(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load batches', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load courses', err);
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchCourses();
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const selectedCourse = courses.find((c) => c.grade === formData.grade) || courses[0];
      const payload = {
        ...formData,
        course: formData.courseId || selectedCourse?._id,
      };

      const response = await api.post('/batches', payload);
      if (response.data.success) {
        setShowModal(false);
        fetchBatches();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to create batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Batches & Scheduling</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Define classroom batches, schedules, and monitor student capacity.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Batch</span>
        </button>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Loading batches...</div>
        ) : batches.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500">No batches defined yet.</div>
        ) : (
          batches.map((batch) => {
            const percentage = Math.round((batch.currentEnrollment / (batch.maxCapacity || 40)) * 100);
            return (
              <div key={batch._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                      {batch.grade} Commerce
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{batch.name}</h3>
                    <p className="text-xs font-semibold text-slate-400">Code: {batch.code}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {batch.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{batch.scheduleTime}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-700">
                    <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>
                      {batch.currentEnrollment} / {batch.maxCapacity} Enrolled ({percentage}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        percentage > 85 ? 'bg-rose-500' : percentage > 50 ? 'bg-indigo-600' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Year: {batch.academicYear}</span>
                  <span className="text-slate-600 font-semibold">Max 40 Students</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create Class Batch</h2>
            <p className="text-xs text-slate-500 mb-6">Set up a new cohort for the 2026-2027 academic session.</p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 12th Commerce Morning Achievers"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="12C-MORN-26"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Grade *</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="12th">12th Commerce</option>
                    <option value="11th">11th Commerce</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Class Schedule & Timings *</label>
                <input
                  type="text"
                  required
                  value={formData.scheduleTime}
                  onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                  placeholder="08:00 AM - 11:30 AM (Mon - Sat)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Student Capacity</label>
                  <input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value, 10) || 40 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md disabled:opacity-70"
                >
                  {isSubmitting ? 'Creating...' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
