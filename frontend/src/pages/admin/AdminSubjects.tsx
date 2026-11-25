import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { Subject, Standard } from '../../types';
import { BookOpen, Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

export const AdminSubjects: React.FC = () => {
  const { role } = useAuth();
  const isSuperAdmin = role === 'ADMIN';

  const [standards, setStandards] = useState<Standard[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStandardId, setSelectedStandardId] = useState<string>('');

  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    standardId: '',
    description: '',
    order: 0,
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, stdRes] = await Promise.all([api.get('/subjects'), api.get('/standards')]);
      if (sRes.data.success) {
        setSubjects(sRes.data.data);
      }
      if (stdRes.data.success) {
        setStandards(stdRes.data.data);
        if (stdRes.data.data.length > 0 && !selectedStandardId) {
          setSelectedStandardId(stdRes.data.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load subjects & standards', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeStandard = standards.find((s) => s._id === selectedStandardId) || standards[0];

  // Filter subjects for the selected standard
  const filteredSubjects = subjects.filter((sub) => {
    const stdId = (sub.standard as any)?._id || sub.standard;
    return stdId === (activeStandard?._id || selectedStandardId);
  });

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      standardId: activeStandard?._id || '',
      description: '',
      order: filteredSubjects.length + 1,
      isActive: true,
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditingSubject(sub);
    const stdId = (sub.standard as any)?._id || sub.standard;
    setFormData({
      name: sub.name,
      code: sub.code || '',
      standardId: stdId || activeStandard?._id || '',
      description: sub.description || '',
      order: sub.order || 0,
      isActive: sub.isActive !== undefined ? sub.isActive : true,
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        name: formData.name,
        code: formData.code,
        standard: formData.standardId || activeStandard?._id,
        description: formData.description,
        order: formData.order,
        isActive: formData.isActive,
      };

      if (editingSubject) {
        await api.patch(`/subjects/${editingSubject._id}`, payload);
      } else {
        await api.post('/subjects', payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) {
      return;
    }
    try {
      await api.delete(`/subjects/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete subject');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Subjects Management</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isSuperAdmin
              ? 'Add, edit, and organize subjects taught under each Standard / Stream.'
              : 'Browse subjects taught under each Standard / Stream.'}
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleOpenAdd}
            disabled={standards.length === 0}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        )}
      </div>

      {/* Standard Switcher Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 overflow-x-auto">
        {standards.length > 0 ? (
          standards.map((std) => (
            <button
              key={std._id}
              onClick={() => setSelectedStandardId(std._id)}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                (activeStandard?._id === std._id)
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {std.name}
            </button>
          ))
        ) : (
          <div className="pb-3 text-sm text-slate-400">No standards found. Please add a standard first.</div>
        )}
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Loading subjects...</div>
        ) : filteredSubjects.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
            No subjects added for {activeStandard?.name || 'this Standard'} yet.
            {isSuperAdmin && (
              <div className="mt-3">
                <button
                  onClick={handleOpenAdd}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Subject to {activeStandard?.name}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredSubjects.map((sub, idx) => (
            <div
              key={sub._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 font-extrabold text-base flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>

                  {isSuperAdmin && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit(sub)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit Subject"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{sub.name}</h3>
                  {sub.code && (
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[11px] uppercase">
                      Code: {sub.code}
                    </span>
                  )}
                </div>

                {sub.description ? (
                  <p className="text-xs text-slate-600 leading-relaxed">{sub.description}</p>
                ) : (
                  <p className="text-xs text-slate-400 italic">No description provided</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${sub.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>{sub.isActive ? 'Active Subject' : 'Inactive'}</span>
                </span>
                <span>Taught in {activeStandard?.name}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create / Edit Subject */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Specify subject name, standard association, and optional subject description.
            </p>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Accountancy, Economics, Business Studies"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Standard / Stream *</label>
                <select
                  required
                  value={formData.standardId}
                  onChange={(e) => setFormData({ ...formData, standardId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {standards.map((std) => (
                    <option key={std._id} value={std._id}>
                      {std.name} ({std.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject Code (Optional)</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="ACC11"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what is taught in this subject..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveSub"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isActiveSub" className="font-semibold text-slate-700 select-none">
                  Active (offered in tuition sessions)
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
                  {isSubmitting ? 'Saving...' : editingSubject ? 'Update Subject' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
