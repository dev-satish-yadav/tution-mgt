import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { Batch, Standard, Subject } from '../../types';
import { Plus, Clock, Users, X, Edit2, Trash2, BookOpen, Layers } from 'lucide-react';

export const AdminBatches: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter batches by standard
  const [selectedStandardFilter, setSelectedStandardFilter] = useState<string>('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    standardId: '',
    subjectId: '',
    academicYear: '2026-2027',
    scheduleTime: '08:00 AM - 11:30 AM (Mon - Sat)',
    maxCapacity: 40,
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Helper to extract standard ID from a subject or batch
  const getStandardId = (std: Standard | string | undefined): string => {
    if (!std) return '';
    return typeof std === 'object' ? std._id : std;
  };

  // Helper to extract subject ID
  const getSubjectId = (sub: Subject | string | undefined): string => {
    if (!sub) return '';
    return typeof sub === 'object' ? sub._id : sub;
  };

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

  const fetchStandardsAndSubjects = async () => {
    try {
      const [stdRes, subRes] = await Promise.all([
        api.get('/standards'),
        api.get('/subjects'),
      ]);

      if (stdRes.data.success) {
        setStandards(stdRes.data.data);
      }
      if (subRes.data.success) {
        setSubjects(subRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load standards or subjects', err);
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchStandardsAndSubjects();
  }, []);

  // Filter subjects based on the currently selected standard in the form
  const availableSubjects = subjects.filter((sub) => {
    if (!formData.standardId) return false;
    const subStdId = getStandardId(sub.standard);
    return subStdId === formData.standardId;
  });

  // Handle opening Create modal
  const handleOpenCreate = () => {
    setEditingBatch(null);
    setErrorMsg('');

    const defaultStdId = standards.length > 0 ? standards[0]._id : '';
    const stdSubjects = subjects.filter((s) => getStandardId(s.standard) === defaultStdId);
    const defaultSubId = stdSubjects.length > 0 ? stdSubjects[0]._id : '';

    setFormData({
      name: '',
      code: '',
      standardId: defaultStdId,
      subjectId: defaultSubId,
      academicYear: '2026-2027',
      scheduleTime: '08:00 AM - 11:30 AM (Mon - Sat)',
      maxCapacity: 40,
      isActive: true,
    });
    setShowModal(true);
  };

  // Handle opening Edit modal
  const handleOpenEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setErrorMsg('');

    const stdId = getStandardId(batch.standard);
    const subId = getSubjectId(batch.subject);

    setFormData({
      name: batch.name,
      code: batch.code,
      standardId: stdId,
      subjectId: subId,
      academicYear: batch.academicYear || '2026-2027',
      scheduleTime: batch.scheduleTime,
      maxCapacity: batch.maxCapacity || 40,
      isActive: batch.isActive !== undefined ? batch.isActive : true,
    });
    setShowModal(true);
  };

  // Handle standard change in form (dynamically filters subjects)
  const handleStandardChange = (newStdId: string) => {
    const stdSubjects = subjects.filter((s) => getStandardId(s.standard) === newStdId);
    // If current subjectId does not belong to new standard, select the first subject of the new standard or empty
    const currentStillValid = stdSubjects.some((s) => s._id === formData.subjectId);
    const newSubjectId = currentStillValid ? formData.subjectId : (stdSubjects.length > 0 ? stdSubjects[0]._id : '');

    setFormData((prev) => ({
      ...prev,
      standardId: newStdId,
      subjectId: newSubjectId,
    }));
  };

  // Submit Create or Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.standardId) {
      setErrorMsg('Please select a Standard / Stream');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const selectedStd = standards.find((s) => s._id === formData.standardId);
      const targetGrade = selectedStd ? selectedStd.standard : '';

      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        standard: formData.standardId,
        subject: formData.subjectId ? formData.subjectId : undefined,
        grade: targetGrade,
        academicYear: formData.academicYear.trim(),
        scheduleTime: formData.scheduleTime.trim(),
        maxCapacity: Number(formData.maxCapacity) || 40,
        isActive: formData.isActive,
      };

      if (editingBatch) {
        // Update batch
        const response = await api.patch(`/batches/${editingBatch._id}`, payload);
        if (response.data.success) {
          setShowModal(false);
          fetchBatches();
        }
      } else {
        // Create batch
        const response = await api.post('/batches', payload);
        if (response.data.success) {
          setShowModal(false);
          fetchBatches();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete batch
  const handleDeleteBatch = async (batchId: string, batchName: string) => {
    if (!window.confirm(`Are you sure you want to delete batch "${batchName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await api.delete(`/batches/${batchId}`);
      if (response.data.success) {
        fetchBatches();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete batch');
    }
  };

  // Filtered batches for display
  const displayedBatches = batches.filter((b) => {
    if (selectedStandardFilter === 'ALL') return true;
    return getStandardId(b.standard) === selectedStandardFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Batches & Scheduling</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Define classroom batches by Standard and Subject, manage timings, and monitor student capacity.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Batch</span>
        </button>
      </div>

      {/* Filter Tabs by Standard */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setSelectedStandardFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedStandardFilter === 'ALL'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Standards ({batches.length})
        </button>
        {standards.map((std) => {
          const count = batches.filter((b) => getStandardId(b.standard) === std._id).length;
          return (
            <button
              key={std._id}
              onClick={() => setSelectedStandardFilter(std._id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStandardFilter === std._id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {std.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Loading batches...</div>
        ) : displayedBatches.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">No batches found</p>
            <p className="text-xs text-slate-400 mt-1">
              {selectedStandardFilter === 'ALL'
                ? 'Create a batch using the "Create New Batch" button above.'
                : 'No batches have been created under this standard yet.'}
            </p>
          </div>
        ) : (
          displayedBatches.map((batch) => {
            const percentage = Math.round((batch.currentEnrollment / (batch.maxCapacity || 40)) * 100);
            const stdName = typeof batch.standard === 'object' ? batch.standard?.name : batch.grade ? `${batch.grade} Standard` : 'Standard';
            const subjectName = typeof batch.subject === 'object' ? batch.subject?.name : null;

            return (
              <div
                key={batch._id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-shadow relative group"
              >
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                        {stdName}
                      </span>
                      {subjectName ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold text-xs border border-amber-200">
                          <BookOpen className="w-3 h-3 text-amber-600" />
                          <span>{subjectName}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium text-[11px]">
                          All Subjects
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5">{batch.name}</h3>
                    <p className="text-xs font-semibold text-slate-400">Code: {batch.code}</p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      batch.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {batch.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                {/* Info */}
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

                {/* Footer and Action buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Year: {batch.academicYear}</span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(batch)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Edit Batch"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBatch(batch._id, batch.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Batch"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {editingBatch ? 'Edit Class Batch' : 'Create Class Batch'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {editingBatch
                ? 'Update batch timings, standard, subject, and student capacity.'
                : 'Set up a new cohort linked to a standard and subject.'}
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Batch Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 11th Commerce Accountancy Batch A"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Batch Code */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="11C-ACC-01"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                />
              </div>

              {/* Dependent Dropdowns: Standard & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Standard Dropdown */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Standard / Stream *</label>
                  <select
                    required
                    value={formData.standardId}
                    onChange={(e) => handleStandardChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="" disabled>-- Select Standard --</option>
                    {standards.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Dropdown (Filtered by selected Standard) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject (for Selected Standard)</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">-- All Subjects / General --</option>
                    {availableSubjects.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name} {sub.code ? `(${sub.code})` : ''}
                      </option>
                    ))}
                  </select>
                  {formData.standardId && availableSubjects.length === 0 && (
                    <span className="text-[10px] text-amber-600 block mt-1">
                      No subjects found for this standard yet.
                    </span>
                  )}
                </div>
              </div>

              {/* Class Schedule */}
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

              {/* Capacity and Academic Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Student Capacity</label>
                  <input
                    type="number"
                    min="1"
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

              {/* Active Toggle (especially useful for Edit mode) */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isActive" className="text-slate-700 font-semibold cursor-pointer select-none">
                  Batch is Active & Accepting Enrollments
                </label>
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
                  {isSubmitting
                    ? editingBatch
                      ? 'Saving...'
                      : 'Creating...'
                    : editingBatch
                    ? 'Update Batch'
                    : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
