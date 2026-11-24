import React, { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { StudyMaterial, Subject } from '../../types';
import { FileText, Download, Filter, Search } from 'lucide-react';

export const StudentMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterialsAndSubjects = async () => {
      setLoading(true);
      try {
        const [mRes, sRes] = await Promise.all([
          api.get(selectedSubject ? `/materials?subjectId=${selectedSubject}` : '/materials'),
          api.get('/subjects'),
        ]);

        if (mRes.data.success) setMaterials(mRes.data.data);
        if (sRes.data.success) setSubjects(sRes.data.data);
      } catch (err) {
        console.error('Failed to load study materials', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterialsAndSubjects();
  }, [selectedSubject]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Study Materials & Notes</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Download chapter worksheets, formula sheets, and past board questions.
          </p>
        </div>

        {/* Filter by subject */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm bg-white"
          >
            <option value="">All Enrolled Subjects</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Loading materials...</div>
        ) : materials.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No study materials found for this subject filter.
          </div>
        ) : (
          materials.map((mat) => (
            <div key={mat._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                    {mat.subject?.name}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{mat.title}</h3>
                {mat.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mat.description}</p>}
                {mat.chapter && <p className="text-xs text-indigo-600 font-medium mt-2">{mat.chapter}</p>}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">PDF Document</span>
                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
