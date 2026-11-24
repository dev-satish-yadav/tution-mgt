import React, { useEffect, useState } from 'react';
import { BookOpen, Target, Heart, Award, ShieldCheck, Users, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios';
import { Teacher } from '../../types';

export const AboutPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get('/teachers/public?isActive=true&limit=12');
        if (response.data?.success && response.data?.data) {
          setTeachers(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load teachers for about page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const getInitials = (name: string) => {
    return name
      .replace(/^(Prof\.|Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '')
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getAvatarBg = (index: number) => {
    const colors = [
      'bg-indigo-100 text-indigo-700',
      'bg-violet-100 text-violet-700',
      'bg-emerald-100 text-emerald-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
      'bg-cyan-100 text-cyan-700',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Header */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            About Apex Commerce Academy
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Nurturing Excellence in 11th & 12th Commerce
          </h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            Founded with a singular vision: to establish an elite center of learning dedicated exclusively to commerce
            education, ethical principles, and academic distinction.
          </p>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Our Journey: From Classroom to Modern Learning Ecosystem
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Apex Commerce Academy was established in 2011 by a group of passionate Chartered Accountants and university
              professors who recognized that commerce students required specialized pedagogy—moving far beyond rote
              memorization towards conceptual analytical thinking.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Over the last decade, we have nurtured more than 1,200 students into top colleges such as SRCC, St. Xavier's,
              NMIMS, and Christ University, while maintaining an unmatched pass percentage of 98.4% in CBSE and state board
              examinations.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                <span className="text-3xl font-extrabold text-indigo-600 block">15+</span>
                <span className="text-xs font-semibold text-slate-700">Years of Coaching Pedagogy</span>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                <span className="text-3xl font-extrabold text-indigo-600 block">100%</span>
                <span className="text-xs font-semibold text-slate-700">Focus on Commerce Stream</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Our Mission</h3>
                <p className="text-sm text-slate-600 mt-1">
                  To empower high school commerce students with deep conceptual clarity, rigorous problem-solving habits,
                  and digital learning resources that pave the way for academic and professional distinction.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Our Philosophy</h3>
                <p className="text-sm text-slate-600 mt-1">
                  We believe no student is weak in Accountancy or Economics; they only lack visualization of real-world
                  financial transactions. We bridge theory and practical applications in every session.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Complete Accountability</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Timely syllabus completion, weekly tests, detailed answer sheet evaluations, and regular parent-teacher
                  updates form our core operational framework.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Faculty */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Faculty Mentors</h2>
            <p className="text-3xl font-extrabold text-slate-900">Guided by Veteran Commerce Educators</p>
            <p className="text-sm text-slate-600 mt-2">
              Our faculty members bring decades of classroom mastery and real-world accounting and economic experience.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white p-6 rounded-2xl border border-slate-200 h-64 flex flex-col items-center justify-center space-y-4">
                  <div className="w-20 h-20 bg-slate-200 rounded-full"></div>
                  <div className="w-32 h-4 bg-slate-200 rounded"></div>
                  <div className="w-24 h-3 bg-slate-200 rounded"></div>
                  <div className="w-full h-12 bg-slate-100 rounded"></div>
                </div>
              ))}
            </div>
          ) : teachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachers.map((teacher, idx) => (
                <div
                  key={teacher._id}
                  className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-center space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div
                      className={`w-20 h-20 rounded-full font-extrabold text-2xl flex items-center justify-center mx-auto shadow-inner ${getAvatarBg(
                        idx
                      )}`}
                    >
                      {getInitials(teacher.user?.name || 'Faculty Member')}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{teacher.user?.name}</h3>
                      <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                        {teacher.qualification || 'Commerce Specialist'}
                        {teacher.experienceYears ? ` • ${teacher.experienceYears}+ yrs exp` : ''}
                      </p>
                    </div>

                    {teacher.specialization && teacher.specialization.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-center pt-1">
                        {teacher.specialization.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {teacher.bio ||
                        `Dedicated educator committed to helping 11th and 12th commerce students excel in conceptual problem solving.`}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-center text-[11px] text-slate-400 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                    Faculty Mentor #{teacher.employeeId || `TCH00${idx + 1}`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 text-sm font-medium">Faculty profiles are currently being updated.</p>
              <p className="text-slate-400 text-xs mt-1">Please check back shortly or contact our center for faculty bios.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm space-y-4 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900">Experience a Trial Session</h2>
          <p className="text-sm text-slate-600">
            Attend an interactive classroom or online lecture to experience our teaching approach firsthand.
          </p>
          <div className="pt-2">
            <Link
              to="/admission"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md"
            >
              Request Free Demo Class
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
