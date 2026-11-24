import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { Homework } from '../../types';
import { ClipboardList, Calendar, CheckCircle2, Upload, Clock, X } from 'lucide-react';

export const StudentHomework: React.FC = () => {
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Submit modal
  const [selectedHw, setSelectedHw] = useState<Homework | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('https://example.com/aarav_hw1_answers.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hRes, sRes] = await Promise.all([api.get('/homework'), api.get('/homework/my-submissions')]);
      if (hRes.data.success) setHomeworkList(hRes.data.data);
      if (sRes.data.success) setMySubmissions(sRes.data.data);
    } catch (err) {
      console.error('Failed to load homework and submissions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHw) return;
    setIsSubmitting(true);
    try {
      const response = await api.post('/homework/submit', {
        homeworkId: selectedHw._id,
        fileUrl: submissionUrl,
        fileName: `${selectedHw.title.replace(/\s+/g, '_')}_solution.pdf`,
      });

      if (response.data.success) {
        setSuccessMsg('Homework submitted successfully!');
        setTimeout(() => {
          setSelectedHw(null);
          setSuccessMsg('');
          fetchData();
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to submit homework', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Homework & Assignments</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Complete exercises, upload solution files, and review teacher remarks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Loading homework...</div>
        ) : homeworkList.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No homework assigned at this time.
          </div>
        ) : (
          homeworkList.map((hw) => {
            const submission = mySubmissions.find((s) => (s.homework as any)?._id === hw._id || (s.homework as any) === hw._id);
            const isSubmitted = !!submission;

            return (
              <div key={hw._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                      {hw.subject?.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isSubmitted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isSubmitted ? 'SUBMITTED' : 'PENDING'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{hw.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{hw.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: {new Date(hw.dueDate).toLocaleDateString()}</span>
                    </span>
                    <span className="font-semibold text-slate-700">Marks: {hw.totalMarks}</span>
                  </div>

                  {submission && submission.marksObtained !== undefined && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                      <p className="font-bold">Score: {submission.marksObtained} / {hw.totalMarks}</p>
                      {submission.feedback && <p className="text-[11px] mt-0.5">Faculty: "{submission.feedback}"</p>}
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedHw(hw)}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                      isSubmitted
                        ? 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isSubmitted ? 'Resubmit Homework' : 'Submit Homework'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submission Modal */}
      {selectedHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedHw(null)}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Submit Homework</h2>
            <p className="text-xs text-slate-500 mb-4">{selectedHw.title}</p>

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitHomework} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Solution File URL / Cloud Document Link *
                </label>
                <input
                  type="url"
                  required
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="https://.../my_homework_answers.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Upload your PDF / scanned pages to Google Drive, Dropbox, or Cloudinary and paste the link here.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedHw(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md disabled:opacity-70"
                >
                  {isSubmitting ? 'Uploading...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
