import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { Teacher, Batch, Subject } from '../../types';
import { UserPlus, Users, Link2, X, CheckCircle2 } from 'lucide-react';

export const AdminTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Teacher Form state
  const [teacherData, setTeacherData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    qualification: '',
    specialization: 'Financial Accounting, Economics',
    experienceYears: 5,
    bio: '',
  });

  // Assign Form state
  const [assignData, setAssignData] = useState({
    teacherId: '',
    subjectId: '',
    batchId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/teachers');
      if (response.data.success) {
        setTeachers(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load teachers', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchesAndSubjects = async () => {
    try {
      const [batchRes, subRes] = await Promise.all([api.get('/batches'), api.get('/subjects')]);
      if (batchRes.data.success) setBatches(batchRes.data.data);
      if (subRes.data.success) setSubjects(subRes.data.data);
    } catch (err) {
      console.error('Failed to load batches or subjects', err);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchBatchesAndSubjects();
  }, []);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      const payload = {
        ...teacherData,
        specialization: teacherData.specialization.split(',').map((s) => s.trim()),
      };
      const response = await api.post('/teachers', payload);
      if (response.data.success) {
        setShowTeacherModal(false);
        fetchTeachers();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create teacher account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    setAssignSuccess('');

    try {
      const response = await api.post('/teachers/assign', assignData);
      if (response.data.success) {
        setAssignSuccess('Teacher assigned to batch & subject successfully!');
        setTimeout(() => {
          setShowAssignModal(false);
          setAssignSuccess('');
        }, 1500);
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to assign teacher');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Faculty & Teachers</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage academic faculty profiles and batch subject assignments.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAssignModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors"
          >
            <Link2 className="w-4 h-4 text-slate-500" />
            <span>Assign to Batch</span>
          </button>

          <button
            onClick={() => setShowTeacherModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Teacher</span>
          </button>
        </div>
      </div>

      {/* Teachers Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Loading faculty records...</div>
        ) : teachers.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500">No faculty members found.</div>
        ) : (
          teachers.map((t) => (
            <div key={t._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{t.employeeId}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{t.user?.name}</h3>
                  <p className="text-xs text-slate-400">{t.user?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                  {t.user?.name?.charAt(0) || 'T'}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Qualification:</span>
                  <span className="font-semibold text-slate-800">{t.qualification}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Specialization:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {t.specialization.map((spec, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Contact Phone:</span>
                  <span className="text-slate-700">{t.phone}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Add Teacher */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setShowTeacherModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Add Faculty Member</h2>
            <p className="text-xs text-slate-500 mb-6">Create a teacher portal login account.</p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateTeacher} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Faculty Full Name *</label>
                <input
                  type="text"
                  required
                  value={teacherData.name}
                  onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                  placeholder="e.g. Prof. Rajesh Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={teacherData.email}
                    onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                    placeholder="rajesh@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={teacherData.phone}
                    onChange={(e) => setTeacherData({ ...teacherData, phone: e.target.value })}
                    placeholder="9820011223"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Qualification *</label>
                  <input
                    type="text"
                    required
                    value={teacherData.qualification}
                    onChange={(e) => setTeacherData({ ...teacherData, qualification: e.target.value })}
                    placeholder="e.g. FCA, M.Com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="text"
                    value={teacherData.password}
                    onChange={(e) => setTeacherData({ ...teacherData, password: e.target.value })}
                    placeholder="Default: Teacher@123"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Specialization (Comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={teacherData.specialization}
                  onChange={(e) => setTeacherData({ ...teacherData, specialization: e.target.value })}
                  placeholder="Financial Accounting, Microeconomics"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md disabled:opacity-70"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Teacher */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowAssignModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Assign Faculty to Batch</h2>
            <p className="text-xs text-slate-500 mb-6">
              Grant permissions to manage materials, homework, and tests for a batch.
            </p>

            {assignSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{assignSuccess}</span>
              </div>
            )}

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAssignTeacher} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Faculty *</label>
                <select
                  required
                  value={assignData.teacherId}
                  onChange={(e) => setAssignData({ ...assignData, teacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Select teacher</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t.user?._id}>
                      {t.user?.name} ({t.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Subject *</label>
                <select
                  required
                  value={assignData.subjectId}
                  onChange={(e) => setAssignData({ ...assignData, subjectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.grade} - {s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Batch *</label>
                <select
                  required
                  value={assignData.batchId}
                  onChange={(e) => setAssignData({ ...assignData, batchId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Select batch</option>
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name} ({b.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md disabled:opacity-70"
                >
                  {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
