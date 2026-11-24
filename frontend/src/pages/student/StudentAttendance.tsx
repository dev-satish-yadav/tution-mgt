import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { UserCheck, CheckCircle2, XCircle, Calendar } from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get('/attendance/my-summary');
        if (response.data.success) {
          setSummary(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load attendance summary', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400 text-sm">Loading attendance summary...</div>;
  }

  const history = summary?.history || [];
  const percentage = summary?.percentage || 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Attendance Records</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Your personal attendance record and eligibility for board examinations.
        </p>
      </div>

      {/* Percentage Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Academic Presence</span>
          <p className="text-3xl font-extrabold text-slate-900">{percentage}% Attendance</p>
          <p className="text-xs text-slate-500">
            {summary?.presentDays || 0} classes attended out of {summary?.totalDays || 0} total sessions held.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`px-4 py-2 rounded-xl text-xs font-bold ${
              percentage >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {percentage >= 75 ? 'Board Exam Eligible (≥ 75%)' : 'Attention: Low Attendance (< 75%)'}
          </span>
        </div>
      </div>

      {/* Daily Records */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
          Class-by-Class Attendance Timeline
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No attendance recorded yet.</div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {history.map((item: any, idx: number) => {
              const isPresent = item.status === 'PRESENT';
              return (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">
                        {new Date(item.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                        {item.subject?.name}
                      </span>
                    </div>
                    <p className="text-slate-400">{item.batch?.name}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1.5 ${
                      isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isPresent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{item.status}</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
