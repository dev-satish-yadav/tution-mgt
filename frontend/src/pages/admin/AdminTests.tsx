import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { Test, Subject, Batch } from '../../types';
import { CheckSquare, Plus, Clock, Award, X, CheckCircle2 } from 'lucide-react';

export const AdminTests: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
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
    durationMinutes: 30,
    totalMarks: 20,
    passingMarks: 8,
    scheduledDate: new Date().toISOString().split('T')[0],
  });

  // Test question state
  const [questions, setQuestions] = useState([
    {
      questionText: 'In the absence of a partnership agreement, the profit sharing ratio is:',
      options: ['In ratio of capital', 'Equal', 'As decided by the senior partner', 'In ratio of drawings'],
      correctOptionIndex: 1,
      marks: 5,
    },
    {
      questionText: 'Which account is prepared to calculate net profit before appropriation?',
      options: ['Trading Account', 'Profit & Loss Account', 'Balance Sheet', 'Cash Account'],
      correctOptionIndex: 1,
      marks: 5,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tests');
      if (response.data.success) {
        setTests(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load tests', err);
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
    fetchTests();
    fetchDeps();
  }, []);

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        questions,
      };
      const response = await api.post('/tests', payload);
      if (response.data.success) {
        setShowModal(false);
        fetchTests();
      }
    } catch (err) {
      console.error('Failed to create test', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Online Tests & Quizzes</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create online multiple-choice diagnostic assessments and review attempt scores.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Test</span>
        </button>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Loading tests...</div>
        ) : tests.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No tests created yet.
          </div>
        ) : (
          tests.map((test) => (
            <div key={test._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                  {test.grade} • {test.subject?.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {test.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{test.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{test.description || 'Commerce diagnostic quiz'}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 block font-medium">Duration</span>
                  <span className="font-bold text-slate-800">{test.durationMinutes}m</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 block font-medium">Marks</span>
                  <span className="font-bold text-slate-800">{test.totalMarks}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 block font-medium">Questions</span>
                  <span className="font-bold text-slate-800">{test.questions?.length || 0}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Batch: {test.batch?.name}</span>
                <span className="font-semibold text-indigo-600">Pass: {test.passingMarks}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create Online Test</h2>
            <p className="text-xs text-slate-500 mb-6">Define test parameters and multiple choice questions.</p>

            <form onSubmit={handleCreateTest} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Accountancy Unit 1 Diagnostics"
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
                  <label className="block font-semibold text-slate-700 mb-1">Target Batch *</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value, 10) || 30 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Questions Preview */}
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-700 block mb-2">Preloaded Questions ({questions.length})</span>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {questions.map((q, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <p className="font-semibold text-slate-800">
                        Q{idx + 1}: {q.questionText}
                      </p>
                      <p className="text-[10px] text-emerald-700 mt-1">Correct: {q.options[q.correctOptionIndex]}</p>
                    </div>
                  ))}
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
                  {isSubmitting ? 'Publishing...' : 'Publish Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
