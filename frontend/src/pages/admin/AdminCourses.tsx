import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { Course, Subject, Standard } from '../../types';
import { BookOpen, Plus, CheckCircle2, X, Edit2, Trash2, Layers, IndianRupee } from 'lucide-react';

export const AdminCourses: React.FC = () => {
  const { role } = useAuth();
  const isSuperAdmin = role === 'ADMIN';

  const [standards, setStandards] = useState<Standard[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStandardId, setSelectedStandardId] = useState<string>('');

  // Course Modal state (Super Admin Add / Edit)
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    slug: '',
    grade: '12th',
    standardId: '',
    stream: 'Commerce',
    description: '',
    feeAmount: 35000,
    durationMonths: 10,
    features: ['Comprehensive Syllabus Coverage', 'Weekly Mock Drills', 'Previous Year Questions (PYQs)'],
  });

  // Subject Modal state (Super Admin Add / Edit)
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectData, setSubjectData] = useState({
    name: '',
    code: '',
    grade: '12th',
    standardId: '',
    courseId: '',
    description: '',
  });

  // Chapter Modal state (Super Admin Add chapter)
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [targetSubjectForChapter, setTargetSubjectForChapter] = useState<Subject | null>(null);
  const [chapterData, setChapterData] = useState({
    chapterNumber: 1,
    title: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, sRes, stdRes] = await Promise.all([
        api.get('/courses'),
        api.get('/subjects'),
        api.get('/standards'),
      ]);
      if (cRes.data.success) setCourses(cRes.data.data);
      if (sRes.data.success) setSubjects(sRes.data.data);
      if (stdRes.data.success) {
        setStandards(stdRes.data.data);
        if (stdRes.data.data.length > 0 && !selectedStandardId) {
          setSelectedStandardId(stdRes.data.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load courses & subjects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeStandard = standards.find((s) => s._id === selectedStandardId) || standards[0];
  const activeGrade = activeStandard?.standard || '12th';

  const filteredSubjects = subjects.filter((s) => {
    const stdId = (s.standard as any)?._id || s.standard;
    if (stdId && selectedStandardId) {
      return stdId === selectedStandardId;
    }
    return s.grade === activeGrade;
  });

  const activeCourse = courses.find((c) => {
    const stdId = (c.standard as any)?._id || c.standard;
    if (stdId && selectedStandardId) {
      return stdId === selectedStandardId;
    }
    return c.grade === activeGrade;
  });

  // Open Add Course Modal
  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseFormData({
      title: '',
      slug: '',
      grade: activeGrade,
      standardId: activeStandard?._id || '',
      stream: activeStandard?.stream || 'Commerce',
      description: '',
      feeAmount: 35000,
      durationMonths: 10,
      features: ['Comprehensive Syllabus Coverage', 'Weekly Mock Drills', 'Previous Year Questions (PYQs)'],
    });
    setErrorMsg('');
    setShowCourseModal(true);
  };

  // Open Edit Course Modal
  const handleOpenEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseFormData({
      title: course.title,
      slug: course.slug,
      grade: course.grade,
      standardId: (course.standard as any)?._id || (course.standard as string) || activeStandard?._id || '',
      stream: course.stream || 'Commerce',
      description: course.description || '',
      feeAmount: course.feeAmount || 0,
      durationMonths: course.durationMonths || 10,
      features: course.features || [],
    });
    setErrorMsg('');
    setShowCourseModal(true);
  };

  // Save Course (Create or Update)
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        ...courseFormData,
        standard: courseFormData.standardId || activeStandard?._id,
      };
      if (editingCourse) {
        await api.patch(`/courses/${editingCourse._id}`, payload);
      } else {
        await api.post('/courses', payload);
      }
      setShowCourseModal(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course? Associated subjects may be affected.')) {
      return;
    }
    try {
      await api.delete(`/courses/${courseId}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete course');
    }
  };

  // Open Add Subject Modal
  const handleOpenAddSubject = () => {
    setEditingSubject(null);
    setSubjectData({
      name: '',
      code: '',
      grade: activeGrade,
      standardId: activeStandard?._id || '',
      courseId: activeCourse?._id || '',
      description: '',
    });
    setErrorMsg('');
    setShowSubjectModal(true);
  };

  // Open Edit Subject Modal
  const handleOpenEditSubject = (sub: Subject) => {
    setEditingSubject(sub);
    setSubjectData({
      name: sub.name,
      code: sub.code,
      grade: sub.grade,
      standardId: (sub.standard as any)?._id || (sub.standard as string) || activeStandard?._id || '',
      courseId: (sub.course as any)?._id || (sub.course as string) || '',
      description: sub.description || '',
    });
    setErrorMsg('');
    setShowSubjectModal(true);
  };

  // Save Subject (Create or Update)
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const targetCourse = activeCourse || courses[0];
      const payload = {
        ...subjectData,
        standard: subjectData.standardId || activeStandard?._id,
        course: subjectData.courseId || targetCourse?._id,
      };

      if (editingSubject) {
        await api.patch(`/subjects/${editingSubject._id}`, payload);
      } else {
        await api.post('/subjects', {
          ...payload,
          chapters: [
            { chapterNumber: 1, title: 'Introduction & Core Foundations' },
            { chapterNumber: 2, title: 'Principles & Analytical Framework' },
          ],
        });
      }
      setShowSubjectModal(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Subject
  const handleDeleteSubject = async (subjectId: string) => {
    if (!window.confirm('Are you sure you want to delete this subject and its chapter syllabus?')) {
      return;
    }
    try {
      await api.delete(`/subjects/${subjectId}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete subject');
    }
  };

  // Open Add Chapter Modal
  const handleOpenAddChapter = (sub: Subject) => {
    setTargetSubjectForChapter(sub);
    setChapterData({
      chapterNumber: (sub.chapters?.length || 0) + 1,
      title: '',
      description: '',
    });
    setErrorMsg('');
    setShowChapterModal(true);
  };

  // Submit Chapter
  const handleAddChapterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSubjectForChapter) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await api.post(`/subjects/${targetSubjectForChapter._id}/chapters`, chapterData);
      setShowChapterModal(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to add chapter');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Courses & Syllabus Management</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isSuperAdmin
              ? 'Create, edit, and organize curriculum programs, subjects, and chapter syllabi.'
              : 'Review standard academic syllabus, chapter divisions, and subject codes.'}
          </p>
        </div>

        {isSuperAdmin && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleOpenAddCourse}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Add Course</span>
            </button>
            <button
              onClick={handleOpenAddSubject}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
          </div>
        )}
      </div>

      {/* Standard / Stream Switcher Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 overflow-x-auto">
        {standards.length > 0 ? (
          standards.map((std) => (
            <button
              key={std._id}
              onClick={() => setSelectedStandardId(std._id)}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                selectedStandardId === std._id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {std.name}
            </button>
          ))
        ) : (
          <div className="pb-3 text-sm text-slate-400">No standards configured yet</div>
        )}
      </div>

      {/* Course Info Card */}
      {activeCourse ? (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                {activeCourse.grade} Commerce
              </span>
              <span className="text-xs text-slate-400 font-medium">Slug: /{activeCourse.slug}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{activeCourse.title}</h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">{activeCourse.description}</p>

            {activeCourse.features && activeCourse.features.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {activeCourse.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium"
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Annual Program Fee</span>
              <span className="text-2xl font-extrabold text-indigo-600 flex items-center justify-end">
                <IndianRupee className="w-5 h-5 mr-0.5" />
                {activeCourse.feeAmount?.toLocaleString()}
              </span>
            </div>

            {isSuperAdmin && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEditCourse(activeCourse)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1"
                  title="Edit Course Details"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteCourse(activeCourse._id)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold flex items-center space-x-1"
                  title="Delete Course"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 bg-white rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm text-slate-500 font-medium">No program course configured for {activeStandard?.name || 'this Standard'}.</p>
          {isSuperAdmin && (
            <button
              onClick={handleOpenAddCourse}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Create Course for {activeStandard?.name || 'Standard'}</span>
            </button>
          )}
        </div>
      )}

      {/* Subject List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Loading syllabus...</div>
        ) : filteredSubjects.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No subjects added for this grade yet.
          </div>
        ) : (
          filteredSubjects.map((sub, idx) => (
            <div key={sub._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{sub.name}</h3>
                      <span className="text-xs font-semibold text-slate-400">Subject Code: {sub.code}</span>
                    </div>
                  </div>

                  {isSuperAdmin && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEditSubject(sub)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit Subject"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(sub._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {sub.description && (
                  <p className="text-xs text-slate-500 leading-relaxed">{sub.description}</p>
                )}

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chapters & Units:</p>
                    {isSuperAdmin && (
                      <button
                        onClick={() => handleOpenAddChapter(sub)}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Chapter</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    {sub.chapters && sub.chapters.length > 0 ? (
                      sub.chapters.map((ch, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-slate-800">Ch {ch.chapterNumber}:</strong> {ch.title}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">No chapters configured</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{sub.grade} Curriculum</span>
                <span>{sub.chapters?.length || 0} Topics</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Add / Edit Course */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCourseModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {editingCourse ? 'Edit Course Program' : `Create Course for ${activeStandard?.name || 'Standard'}`}
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Super Admin control for programs displayed on the website and student portal.
            </p>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                  placeholder="e.g. 12th Commerce Comprehensive Mastery"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slug (URL path) *</label>
                  <input
                    type="text"
                    required
                    value={courseFormData.slug}
                    onChange={(e) => setCourseFormData({ ...courseFormData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="12-commerce"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grade</label>
                  <select
                    value={courseFormData.grade}
                    onChange={(e) => setCourseFormData({ ...courseFormData, grade: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="11th">11th Commerce</option>
                    <option value="12th">12th Commerce</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Annual Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={courseFormData.feeAmount}
                    onChange={(e) => setCourseFormData({ ...courseFormData, feeAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={courseFormData.durationMonths}
                    onChange={(e) => setCourseFormData({ ...courseFormData, durationMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Description *</label>
                <textarea
                  rows={3}
                  required
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                  placeholder="Overview of the course and teaching approach..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md disabled:opacity-70"
                >
                  {isSubmitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Subject */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowSubjectModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {editingSubject ? 'Edit Subject' : `Add Subject to ${activeStandard?.name || 'Standard'}`}
            </h2>
            <p className="text-xs text-slate-500 mb-5">Configure subject title, syllabus code, and curriculum tier.</p>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
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

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block font-semibold text-slate-700 mb-1">Grade</label>
                  <select
                    value={subjectData.grade}
                    onChange={(e) => setSubjectData({ ...subjectData, grade: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="11th">11th Commerce</option>
                    <option value="12th">12th Commerce</option>
                  </select>
                </div>
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
                  {isSubmitting ? 'Saving...' : editingSubject ? 'Update Subject' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Chapter to Subject */}
      {showChapterModal && targetSubjectForChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowChapterModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Add Chapter</h2>
            <p className="text-xs text-slate-500 mb-5">
              Add a new syllabus unit to <strong>{targetSubjectForChapter.name}</strong>.
            </p>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddChapterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chapter / Unit Number *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={chapterData.chapterNumber}
                  onChange={(e) => setChapterData({ ...chapterData, chapterNumber: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chapter Title *</label>
                <input
                  type="text"
                  required
                  value={chapterData.title}
                  onChange={(e) => setChapterData({ ...chapterData, title: e.target.value })}
                  placeholder="e.g. Accounting for Partnership Firms"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit Description (Optional)</label>
                <textarea
                  rows={2}
                  value={chapterData.description}
                  onChange={(e) => setChapterData({ ...chapterData, description: e.target.value })}
                  placeholder="Topics covered in this chapter..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowChapterModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md disabled:opacity-70"
                >
                  {isSubmitting ? 'Adding...' : 'Add Chapter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
