import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { Student, Batch } from '../../types';
import { Search, UserPlus, Filter, X, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    grade: '12th',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    batchId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let query = `/students?`;
      if (search) query += `search=${encodeURIComponent(search)}&`;
      if (gradeFilter) query += `grade=${gradeFilter}&`;

      const response = await api.get(query);
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await api.get('/batches');
      if (response.data.success) {
        setBatches(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load batches', err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchBatches();
  }, [gradeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      const response = await api.post('/students', formData);
      if (response.data.success) {
        setShowModal(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          grade: '12th',
          parentName: '',
          parentPhone: '',
          parentEmail: '',
          address: '',
          batchId: '',
        });
        fetchStudents();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create student account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStudentStatus = async (studentId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/students/${studentId}`, { isActive: !currentStatus });
      fetchStudents();
    } catch (err) {
      console.error('Failed to update student status', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Student Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, manage enrollments, and oversee academic profiles for 11th & 12th Commerce.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
          />
        </form>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm bg-white"
          >
            <option value="">All Grades</option>
            <option value="11th">11th Commerce</option>
            <option value="12th">12th Commerce</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading student directory...</div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="font-semibold text-slate-700">No students found</p>
            <p className="text-xs text-slate-400">Click "Add New Student" to enroll your first student account.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Grade & Stream</th>
                  <th className="py-3 px-4">Assigned Batch</th>
                  <th className="py-3 px-4">Parent / Guardian</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => {
                  const isActive = student.user?.isActive;
                  return (
                    <tr key={student._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{student.rollNo}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{student.user?.name}</p>
                        <p className="text-slate-400">{student.user?.email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                          {student.grade}
                        </span>
                        <span className="ml-1 text-slate-500">{student.stream}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {student.batch ? (
                          <span className="font-medium text-slate-700">{student.batch.name}</span>
                        ) : (
                          <span className="text-amber-600 font-medium">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-700">{student.parentName}</p>
                        <p className="text-slate-400">{student.parentPhone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => toggleStudentStatus(student._id, isActive)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                            isActive
                              ? 'border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-1">Create Student Account</h2>
            <p className="text-xs text-slate-500 mb-6">
              Enrolls the student into the system with credentials to log in to the student portal.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Riya Shah"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="riya@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Password (min 6 chars)</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Default: Student@123"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grade Standard *</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="e.g. Mukesh Shah"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parent Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="e.g. 9820123456"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign to Batch</label>
                <select
                  value={formData.batchId}
                  onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Select a batch (Optional)</option>
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name} ({b.grade} - {b.scheduleTime})
                    </option>
                  ))}
                </select>
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
                  {isSubmitting ? 'Creating...' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
