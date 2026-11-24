import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { Course, Subject } from '../../types';
import { BookOpen, Plus, CheckCircle2, X } from 'lucide-react';

export const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<'11th' | '12th'>('12th');

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subjectData, setSubjectData] = useState({
    name: '',
    code: '',
    grade: '12th',
    courseId: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([api.get('/courses'), api.get('/subjects')]);
      if (cRes.data.success) setCourses(cRes.data.data);
      if (sRes.data.success) setSubjects(sRes.data.data);
    } catch (err) {
      console.error('Failed to load courses & subjects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSubjects = subjects.filter((s) => s.grade === selectedGrade);
  const activeCourse = courses.find((c) => c.grade === selectedGrade);

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const targetCourse = activeCourse || courses[0];
      const payload = {
        ...subjectData,
        course: targetCourse?._id,
        chapters: [
          { chapterNumber: 1, title: 'Foundational Principles & Concepts' },
          { chapterNumber: 2, title: 'Practical Accounting & Numerical Applications' },
        ],
      };
      const response = await api.post('/subjects', payload);
      if (response.data.success) {
        setShowSubjectModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to create subject', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Courses & Syllabus Management</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Define curriculum modules, chapters, and subject structures.
          </p>
        </div>

        <button
          onClick={() => {
            setSubjectData({ ...subjectData, grade: selectedGrade });
            setShowSubjectModal(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject to {selectedGrade}</span>
        </button>
      </div>

      {/* Grade Switcher Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setSelectedGrade('12th')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            selectedGrade === '12th'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          12th Commerce Board Series
        </button>
        <button
          onClick={() => setSelectedGrade('11th')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            selectedGrade === '11th'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          11th Commerce Foundation
        </button>
      </div>

      {/* Course Info Card */}
      {activeCourse && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
              {activeCourse.grade} Commerce
            </span>
            <h2 className="text-xl font-bold text-slate-900">{activeCourse.title}</h2>
            <p className="text-xs text-slate-600 max-w-2xl">{activeCourse.description}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Program Fee</span>
            <span className="text-2xl font-extrabold text-indigo-600">₹{activeCourse.feeAmount?.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Subject List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Loading syllabus...</div>
        ) : filteredSubjects.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500">No subjects added for this grade yet.</div>
        ) : (
          filteredSubjects.map((sub, idx) => (
            <div key={sub._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{sub.name}</h3>
                    <span className="text-xs font-semibold text-slate-400">Subject Code: {sub.code}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chapters & Units:</p>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {sub.chapters && sub.chapters.length > 0 ? (
                    sub.chapters.map((ch, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                        <span>
                          Ch {ch.chapterNumber}: {ch.title}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">No chapters configured</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Add Subject */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowSubjectModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Add Subject to {selectedGrade}</h2>
            <p className="text-xs text-slate-500 mb-6">Create a curriculum subject and assign code.</p>

            <form onSubmit={handleCreateSubject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={subjectData.name}
                  onChange={(e) => setSubjectData({ ...subjectData, name: e.target.value })}
                  placeholder="e.g. Corporate Accounting"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Code *</label>
                <input
                  type="text"
                  required
                  value={subjectData.code}
                  onChange={(e) => setSubjectData({ ...subjectData, code: e.target.value })}
                  placeholder="ACC12"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={subjectData.description}
                  onChange={(e) => setSubjectData({ ...subjectData, description: e.target.value })}
                  placeholder="Subject syllabus goals and references..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md disabled:opacity-70"
                >
                  {isSubmitting ? 'Adding...' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
