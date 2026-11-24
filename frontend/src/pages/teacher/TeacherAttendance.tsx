import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { Batch, Subject, Student } from '../../types';
import { UserCheck, CheckCircle2, XCircle, Save, Calendar, Check } from 'lucide-react';

export const TeacherAttendance: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Map of studentId -> status ('PRESENT' | 'ABSENT' | 'LATE')
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchAssignmentsAndBatches = async () => {
      try {
        const [bRes, sRes] = await Promise.all([api.get('/batches'), api.get('/subjects')]);
        if (bRes.data.success && bRes.data.data.length > 0) {
          setBatches(bRes.data.data);
          setSelectedBatch(bRes.data.data[0]._id);
        }
        if (sRes.data.success && sRes.data.data.length > 0) {
          setSubjects(sRes.data.data);
          setSelectedSubject(sRes.data.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load batches or subjects', err);
      }
    };
    fetchAssignmentsAndBatches();
  }, []);

  // Fetch students for selected batch
  useEffect(() => {
    if (!selectedBatch) return;
    const fetchStudentsForBatch = async () => {
      try {
        const response = await api.get(`/students?batchId=${selectedBatch}`);
        if (response.data.success) {
          setStudents(response.data.data);
          // Default all to PRESENT
          const map: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
          response.data.data.forEach((s: Student) => {
            map[s.user?._id] = 'PRESENT';
          });
          setAttendanceMap(map);
        }
      } catch (err) {
        console.error('Failed to load students for batch', err);
      }
    };
    fetchStudentsForBatch();
  }, [selectedBatch]);

  const toggleStatus = (userId: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [userId]: prev[userId] === 'PRESENT' ? 'ABSENT' : 'PRESENT',
    }));
  };

  const markAll = (status: 'PRESENT' | 'ABSENT') => {
    const map: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
    students.forEach((s) => {
      map[s.user?._id] = status;
    });
    setAttendanceMap(map);
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const records = Object.keys(attendanceMap).map((studentUserId) => ({
      student: studentUserId,
      status: attendanceMap[studentUserId],
    }));

    try {
      const response = await api.post('/attendance', {
        batchId: selectedBatch,
        subjectId: selectedSubject,
        date: attendanceDate,
        records,
      });

      if (response.data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save attendance', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Mark Batch Attendance</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Record daily classroom attendance for assigned commerce cohorts.
          </p>
        </div>

        <button
          onClick={handleSaveAttendance}
          disabled={isSaving || students.length === 0}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Submitting...' : 'Save Attendance'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Attendance successfully recorded for {new Date(attendanceDate).toLocaleDateString()}!</span>
        </div>
      )}

      {/* Control Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">Select Batch</label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name} ({b.grade})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">Select Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">Session Date</label>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Roster Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Student Attendance Roster ({students.length} Enrolled)</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => markAll('PRESENT')}
              className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200"
            >
              Mark All Present
            </button>
            <button
              onClick={() => markAll('ABSENT')}
              className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-semibold hover:bg-rose-200"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No students currently enrolled in this batch.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {students.map((student) => {
              const uId = student.user?._id;
              const status = attendanceMap[uId] || 'PRESENT';
              const isPresent = status === 'PRESENT';

              return (
                <div
                  key={student._id}
                  onClick={() => toggleStatus(uId)}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {student.rollNo.slice(-3)}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{student.user?.name}</p>
                      <p className="text-xs text-slate-400">Roll: {student.rollNo} • Parent: {student.parentPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {status}
                    </span>
                    <button
                      type="button"
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isPresent ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {isPresent ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>
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
