import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { StudyMaterial, Subject, Batch } from '../../types';
import { FileText, Plus, Download, Trash2, X } from 'lucide-react';

export const AdminMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Commerce_Study_Notes.pdf',
    grade: '12th',
    subjectId: '',
    batchId: '',
    chapter: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await api.get('/materials');
      if (response.data.success) {
        setMaterials(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load study materials', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [sRes, bRes] = await Promise.all([api.get('/subjects'), api.get('/batches')]);
      if (sRes.data.success) setSubjects(sRes.data.data);
      if (bRes.data.success) setBatches(bRes.data.data);
    } catch (err) {
      console.error('Failed to fetch dependencies', err);
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchDependencies();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post('/materials', formData);
      if (response.data.success) {
        setShowModal(false);
        fetchMaterials();
      }
    } catch (err) {
      console.error('Failed to upload material', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this study material?')) return;
    try {
      await api.delete(`/materials/${id}`);
      fetchMaterials();
    } catch (err) {
      console.error('Failed to delete material', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Study Materials & Notes</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload and organize lecture PDFs, formula cheat-sheets, and worksheets.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Material</span>
        </button>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Loading materials...</div>
        ) : materials.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No study materials uploaded yet.
          </div>
        ) : (
          materials.map((mat) => (
            <div key={mat._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <button
                  onClick={() => handleDelete(mat._id)}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Delete file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                  {mat.grade} • {mat.subject?.name}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">{mat.title}</h3>
                {mat.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mat.description}</p>}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">{mat.fileName}</span>
                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
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
            <h2 className="text-xl font-bold text-slate-900 mb-1">Upload Study Material</h2>
            <p className="text-xs text-slate-500 mb-6">Distribute documents to enrolled students.</p>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Partnership Appropriation Notes"
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">File URL or PDF Link *</label>
                <input
                  type="url"
                  required
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="https://.../notes.pdf"
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
                  {isSubmitting ? 'Uploading...' : 'Publish Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
