import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { Standard } from '../../types';
import { Layers, Plus, Edit2, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminStandards: React.FC = () => {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    standard: '12th',
    stream: 'Commerce',
    description: '',
    order: 0,
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStandards = async () => {
    setLoading(true);
    try {
      const response = await api.get('/standards');
      if (response.data.success) {
        setStandards(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load standards', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, []);

  const handleOpenAdd = () => {
    setEditingStandard(null);
    setFormData({
      name: '',
      code: '',
      standard: '12th',
      stream: 'Commerce',
      description: '',
      order: standards.length + 1,
      isActive: true,
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (std: Standard) => {
    setEditingStandard(std);
    setFormData({
      name: std.name,
      code: std.code,
      standard: std.standard || '12th',
      stream: std.stream || 'Commerce',
      description: std.description || '',
      order: std.order || 0,
      isActive: std.isActive !== undefined ? std.isActive : true,
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (editingStandard) {
        await api.patch(`/standards/${editingStandard._id}`, formData);
      } else {
        await api.post('/standards', formData);
      }
      setShowModal(false);
      fetchStandards();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save standard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this Standard/Stream? Associated courses and batches will lose standard linking.')) {
      return;
    }
    try {
      await api.delete(`/standards/${id}`);
      fetchStandards();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete standard');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Standards & Streams</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Define academic streams (e.g., 11th Commerce, 12th Commerce) that drive courses, subjects, and batch schedules.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Standard / Stream</span>
        </button>
      </div>

      {/* Grid of Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Loading standards...</div>
        ) : standards.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
            No Standards or Streams added yet. Click &quot;Add Standard / Stream&quot; above to create one.
          </div>
        ) : (
          standards.map((std) => (
            <div
              key={std._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                    {std.code}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(std)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Edit Standard"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(std._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Standard"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{std.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Tier: {std.standard} • Stream: {std.stream}
                  </p>
                </div>

                {std.description ? (
                  <p className="text-xs text-slate-600 leading-relaxed">{std.description}</p>
                ) : (
                  <p className="text-xs text-slate-400 italic">No description provided</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${std.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>{std.isActive ? 'Active Stream' : 'Inactive'}</span>
                </span>
                <span>Display Order: #{std.order}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create / Edit Standard */}
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
              {editingStandard ? 'Edit Standard / Stream' : 'Add Standard / Stream'}
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Configure academic level, stream code, and status.
            </p>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Standard / Stream Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 12th Commerce"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code / Identifier *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="STD-12-COMM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grade / Level *</label>
                  <input
                    type="text"
                    required
                    value={formData.standard}
                    onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                    placeholder="e.g. 12th"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stream Name</label>
                  <input
                    type="text"
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                    placeholder="e.g. Commerce"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Academic objectives and targets..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveStd"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isActiveStd" className="font-semibold text-slate-700 select-none">
                  Active (offered in tuition programs)
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
                  {isSubmitting ? 'Saving...' : editingStandard ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
