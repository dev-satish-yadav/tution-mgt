import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { Batch, Subject } from '../../types';
import { UserCheck, Calendar, Filter } from 'lucide-react';

export const AdminAttendance: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await api.get('/batches');
        if (response.data.success && response.data.data.length > 0) {
          setBatches(response.data.data);
          setSelectedBatch(response.data.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load batches', err);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    if (!selectedBatch) return;
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/attendance?batchId=${selectedBatch}`);
        if (response.data.success) {
          setAttendanceRecords(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load attendance', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [selectedBatch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Attendance Registry</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor classroom presence records and parent reporting logs.
          </p>
        </div>

        {/* Batch filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm bg-white"
          >
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name} ({b.grade})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading attendance history...</div>
        ) : attendanceRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <p className="font-semibold text-slate-700">No attendance records found for this batch yet.</p>
            <p className="text-xs text-slate-400">
              Assigned faculty can mark daily attendance from their Faculty Portal.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {attendanceRecords.map((att) => {
              const total = att.records?.length || 0;
              const present = att.records?.filter((r: any) => r.status === 'PRESENT').length || 0;
              const rate = total > 0 ? Math.round((present / total) * 100) : 100;

              return (
                <div key={att._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-bold text-slate-900 text-sm">
                        {new Date(att.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                        {att.subject?.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Marked for batch: <span className="text-slate-600 font-medium">{att.batch?.name}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 text-xs">
                    <div className="text-right">
                      <span className="text-slate-400 block font-medium">Turnout</span>
                      <span className="font-bold text-slate-800">
                        {present} / {total} Present
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center font-extrabold text-indigo-700">
                      {rate}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
