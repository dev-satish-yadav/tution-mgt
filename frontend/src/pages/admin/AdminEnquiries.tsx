import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { Enquiry } from '../../types';
import { Mail, CheckCircle2, Clock, Phone, Filter, MessageSquare } from 'lucide-react';

export const AdminEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/enquiries?status=${statusFilter}` : '/enquiries';
      const response = await api.get(url);
      if (response.data.success) {
        setEnquiries(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const updateStatus = async (enquiryId: string, newStatus: string) => {
    try {
      await api.patch(`/enquiries/${enquiryId}`, { status: newStatus });
      fetchEnquiries();
    } catch (err) {
      console.error('Failed to update enquiry status', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Admission Enquiries</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Leads received from prospective students and parents on the website.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm bg-white"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONVERTED">Converted (Enrolled)</option>
            <option value="REJECTED">Rejected / Inactive</option>
          </select>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
            Loading enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No admission enquiries match the selected filter.
          </div>
        ) : (
          enquiries.map((enq) => (
            <div
              key={enq._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-slate-900 text-base">{enq.fullName}</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                    {enq.grade} Standard
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      enq.status === 'NEW'
                        ? 'bg-rose-100 text-rose-800'
                        : enq.status === 'CONTACTED'
                        ? 'bg-amber-100 text-amber-800'
                        : enq.status === 'CONVERTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-700">{enq.phone}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{enq.email}</span>
                  </span>
                  {enq.schoolName && <span>School: {enq.schoolName}</span>}
                  <span>Received: {new Date(enq.createdAt).toLocaleDateString()}</span>
                </div>

                {enq.message && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                    "{enq.message}"
                  </p>
                )}
              </div>

              {/* Status Update Dropdown */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <span className="text-xs text-slate-400 font-medium">Update Status:</span>
                <select
                  value={enq.status}
                  onChange={(e) => updateStatus(enq._id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="CONVERTED">CONVERTED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
