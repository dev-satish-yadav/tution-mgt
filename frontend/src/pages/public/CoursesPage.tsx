import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { BookOpen, CheckCircle2, ArrowRight, Clock, Award, Users, Lock } from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const { settings } = useSettings();

  // Validation: If courses option is disabled, show notice
  if (!settings.showCourses) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Course Syllabus Under Review</h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The course catalog page has been temporarily set to private by the administration while updates are made.
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

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            Academic Curriculum
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Our Commerce Programs</h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            Structured syllabi, veteran faculty guidance, and integrated board + competitive test training for 11th & 12th
            standards.
          </p>
        </div>
      </section>

      {/* Courses Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 11th Course Card (if enabled) */}
          {settings.showGrade11 && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs">
                    Class 11
                  </span>
                  <span className="text-xs font-semibold text-slate-500">12 Months</span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-3">11th Commerce Comprehensive Mastery</h2>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Build an invincible foundation in core commerce subjects. This course sets the fundamental mechanics
                  essential for high scores in Class 12 and professional entrance examinations.
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 space-y-2">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Subjects Covered:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                    <span>• Financial Accounting</span>
                    <span>• Microeconomics</span>
                    <span>• Statistics for Economics</span>
                    <span>• Business Studies</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-slate-700 space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Double-entry accounting mechanics & financial statements</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-700 space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Consumer equilibrium, elasticity & production theory</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-700 space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Weekly chapter quizzes with automated online evaluation</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Annual Program Fee</span>
                  <span className="text-xl font-bold text-slate-900">₹35,000</span>
                </div>
                <Link
                  to="/courses/11-commerce"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-indigo-600 transition-colors"
                >
                  <span>Full Syllabus</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* 12th Course Card (if enabled) */}
          {settings.showGrade12 && (
            <div className="bg-white rounded-3xl p-8 border-2 border-indigo-600 shadow-md hover:shadow-2xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-xs">
                    Class 12 • Flagship
                  </span>
                  <span className="text-xs font-semibold text-slate-500">12 Months + Mocks</span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-3">12th Commerce Board & CUET Excellence</h2>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Elite board coaching tailored to maximize 95%+ marks. Includes intensive answer-writing drills, board
                  examiner moderation, and CUET domain preparation.
                </p>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 mb-6 space-y-2">
                  <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Subjects Covered:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-800">
                    <span>• Corporate & Partnership Accounts</span>
                    <span>• Macroeconomics</span>
                    <span>• Indian Economic Development</span>
                    <span>• Business Management</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-slate-700 space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>Partnership, Share Capital & Cash Flow Statements mastery</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-700 space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>National Income accounting & Government Budget calculations</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-700 space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>10 full-length mock examinations with examiner corrections</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Annual Program Fee</span>
                  <span className="text-xl font-bold text-indigo-600">₹42,000</span>
                </div>
                <Link
                  to="/courses/12-commerce"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow"
                >
                  <span>Full Syllabus</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Course Inclusions */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">What Every Enrollment Includes</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">Complete 360-Degree Academic Support</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
              <Award className="w-6 h-6 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Printed Workbooks & LMS Notes</h3>
              <p className="text-xs text-slate-600">
                Formula cheat-sheets, solved past board papers, and chapter-by-chapter theory notes accessible online and offline.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
              <Clock className="w-6 h-6 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Regular Batch Timings</h3>
              <p className="text-xs text-slate-600">
                Consistent morning and evening batch options that coordinate with regular school schedules and avoid burnout.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
              <Users className="w-6 h-6 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Weekly Doubt Clinics</h3>
              <p className="text-xs text-slate-600">
                1-on-1 scheduled sessions with teachers to clear specific calculation hurdles and tricky case questions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
