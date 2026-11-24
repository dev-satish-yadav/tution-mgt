import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { Homework, Subject, Batch } from '../../types';
import { ClipboardList, Plus, Calendar, Clock, X, CheckCircle2 } from 'lucide-react';

export const AdminHomework: React.FC = () => {
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    grade: '12th',
    subjectId: '',
    batchId: '',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalMarks: 20,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHomework = async () => {
    setLoading(true);
    try {
      const response = await api.get('/homework');
      if (response.data.success) {
        setHomeworkList(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load homework', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeps = async () => {
    try {
      const [sRes, bRes] = await Promise.all([api.get('/subjects'), api.get('/batches')]);
      if (sRes.data.success) setSubjects(sRes.data.data);
      if (bRes.data.success) setBatches(bRes.data.data);
    } catch (err) {
      console.error('Failed to fetch dependencies', err);
    }
  };

  useEffect(() => {
    fetchHomework();
    fetchDeps();
  }, []);

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post('/homework', formData);
      if (response.data.success) {
        setShowModal(false);
        fetchHomework();
      }
    } catch (err) {
      console.error('Failed to create homework', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Homework & Assignments</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Assign weekly problem sheets and track student submissions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Homework</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Loading homework...</div>
        ) : homeworkList.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No homework assigned yet.
          </div>
        ) : (
          homeworkList.map((hw) => (
            <div key={hw._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                  {hw.grade} • {hw.subject?.name}
                </span>
                <span className="text-xs font-semibold text-slate-400">Total Marks: {hw.totalMarks}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{hw.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{hw.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due: {new Date(hw.dueDate).toLocaleDateString()}</span>
                </div>
                <span className="font-semibold text-slate-700">{hw.batch?.name}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Assign Homework</h2>
            <p className="text-xs text-slate-500 mb-6">Create homework task with due date and instructions.</p>

            <form onSubmit={handleCreateHomework} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Homework Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Profit & Loss Appropriation Questions 1-15"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grade *</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="12th">12th Commerce</option>
                    <option value="11th">11th Commerce</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                  <select
                    required
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">Select subject</option>
                    {subjects
                      .filter((s) => s.grade === formData.grade)
                      .map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign to Batch *</label>
                  <select
                    required
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">Select batch</option>
                    {batches
                      .filter((b) => b.grade === formData.grade)
                      .map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Submission Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructions / Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the problems to solve, format expectations, and working notes..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
                  {isSubmitting ? 'Assigning...' : 'Publish Homework'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
