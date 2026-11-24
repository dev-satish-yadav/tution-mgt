import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/axios';
import { useSettings } from '../../context/SettingsContext';
import { CheckCircle2, ArrowRight, BookOpen, Clock, FileText, CheckSquare, Award, Lock } from 'lucide-react';
import { Subject } from '../../types';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useSettings();
  const is12th = slug === '12-commerce';
  const grade = is12th ? '12th' : '11th';

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Validation: Check if the teacher or admin has enabled this grade option
  const isEnabled = is12th ? settings.showGrade12 : settings.showGrade11;

  useEffect(() => {
    if (!isEnabled) {
      setLoading(false);
      return;
    }

    const fetchSubjects = async () => {
      try {
        const response = await api.get(`/subjects?grade=${grade}`);
        if (response.data.success) {
          setSubjects(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load course subjects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [grade, isEnabled]);

  if (!isEnabled) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{grade} Commerce Course Inactive</h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            This grade program is currently hidden from public display by the faculty / administration.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors"
            >
              Contact Office
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const courseTitle = is12th
    ? '12th Commerce Board & CUET Excellence'
    : '11th Commerce Comprehensive Mastery';

  const courseDescription = is12th
    ? 'The premier training program designed for 12th Commerce CBSE and State Board students. Focuses on in-depth analytical accounting, macroeconomic theory, and past 10-year question solving.'
    : 'Designed for Class 11 students entering the commerce stream. Establishes deep conceptual foundations in financial accounting, statistics, and microeconomic behavior.';

  const fee = is12th ? '₹42,000' : '₹35,000';
  const batchSchedule = is12th
    ? 'Morning Batch: 08:00 AM - 11:30 AM | Evening Batch: 04:30 PM - 07:30 PM'
    : 'Evening Batch: 04:30 PM - 07:30 PM (Mon - Fri)';

  return (
    <div className="space-y-16 pb-20">
      {/* Hero header */}
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <span>{grade} Commerce Curriculum</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">{courseTitle}</h1>
            <p className="text-base text-slate-300 leading-relaxed">{courseDescription}</p>

            <div className="pt-4 flex flex-wrap gap-4 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center space-x-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>12 Months Comprehensive</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Annual Fee: {fee}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Syllabus and Subjects */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Subject Breakdown & Syllabus Outline</h2>
              <p className="text-sm text-slate-600">
                Our syllabus follows CBSE and state board learning outcomes with rigorous problem solving.
              </p>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading syllabus details...</div>
            ) : (
              <div className="space-y-6">
                {subjects.map((sub, idx) => (
                  <div key={sub._id || idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{sub.name}</h3>
                          <span className="text-xs font-semibold text-slate-400">Code: {sub.code}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-xs">
                        {grade} Standard
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Modules:</p>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {sub.chapters && sub.chapters.length > 0 ? (
                          sub.chapters.map((ch, cIdx) => (
                            <li key={cIdx} className="flex items-center space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                              <span>
                                Chapter {ch.chapterNumber}: {ch.title}
                              </span>
                            </li>
                          ))
                        ) : (
                          <>
                            <li className="flex items-center space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                              <span>Core theoretical foundation and fundamental principles</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                              <span>Numerical calculations and case study applications</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                              <span>Past 10 years board examination solved problems</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Enrollment Info Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Total Program Fee</span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900">{fee}</span>
                  <span className="text-xs text-slate-500 font-medium">/ full year</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Includes all study materials, LMS access & mock series</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 block">Batch Schedule</span>
                  <span className="text-slate-600">{batchSchedule}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Maximum Capacity</span>
                  <span className="text-slate-600">40 Students per batch strictly</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">LMS Access</span>
                  <span className="text-slate-600">Included (web portal login for homework & notes)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                {settings.showAdmissions ? (
                  <Link
                    to="/admission"
                    className="block w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-center font-bold text-sm shadow-md transition-colors"
                  >
                    Apply for Admission
                  </Link>
                ) : (
                  <Link
                    to="/contact"
                    className="block w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-center font-bold text-sm shadow-md transition-colors"
                  >
                    Contact for Availability
                  </Link>
                )}
                <Link
                  to="/contact"
                  className="block w-full mt-2 py-2 text-center text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Have questions? Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
