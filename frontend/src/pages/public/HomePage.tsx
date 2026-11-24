import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import {
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Star,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Calendar,
  Trophy,
  Medal,
  ChevronDown,
  Image,
  Lightbulb,
  HelpCircle,
  Clock,
  Building,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { settings } = useSettings();

  // Selected result year tab
  const [selectedYear, setSelectedYear] = useState<'2025' | '2024' | '2023'>('2025');

  // Selected gallery category filter
  const [galleryFilter, setGalleryFilter] = useState<'ALL' | 'CLASSROOMS' | 'EVENTS' | 'FACULTY'>('ALL');

  // FAQ accordion open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Previous Years Results Data
  const resultsData = {
    '2025': [
      {
        name: 'Priya Sharma',
        score: '98.6%',
        grade: '12th Board',
        highlights: '100/100 in Accountancy • 99 in Economics',
        college: 'SRCC (Shri Ram College of Commerce)',
        avatarColor: 'from-amber-500 to-amber-600',
      },
      {
        name: 'Aarav Singhania',
        score: '97.4%',
        grade: '12th Board',
        highlights: '98 in Business Studies • 97 in Accountancy',
        college: 'St. Xavier\'s College (B.Com Hons)',
        avatarColor: 'from-indigo-500 to-indigo-600',
      },
      {
        name: 'Ananya Deshmukh',
        score: '96.8%',
        grade: '12th Board',
        highlights: '100/100 in Economics • 96 in Statistics',
        college: 'NMIMS School of Commerce',
        avatarColor: 'from-emerald-500 to-emerald-600',
      },
      {
        name: 'Rohan Verma',
        score: '96.2%',
        grade: '12th Board',
        highlights: '98 in Accountancy • CUET 100 Percentile',
        college: 'Hindu College, Delhi University',
        avatarColor: 'from-violet-500 to-violet-600',
      },
    ],
    '2024': [
      {
        name: 'Devansh Mehta',
        score: '98.2%',
        grade: '12th Board',
        highlights: '100/100 in Accountancy • 98 in Economics',
        college: 'SRCC, Delhi University',
        avatarColor: 'from-amber-500 to-amber-600',
      },
      {
        name: 'Sanya Kapoor',
        score: '97.0%',
        grade: '12th Board',
        highlights: '99 in Business Studies • 96 in Statistics',
        college: 'Lady Shri Ram College (LSR)',
        avatarColor: 'from-indigo-500 to-indigo-600',
      },
      {
        name: 'Karan Joshi',
        score: '96.4%',
        grade: '12th Board',
        highlights: '98 in Accountancy • 95 in Economics',
        college: 'Christ University, Bangalore',
        avatarColor: 'from-emerald-500 to-emerald-600',
      },
    ],
    '2023': [
      {
        name: 'Meera Iyer',
        score: '97.8%',
        grade: '12th Board',
        highlights: '99 in Economics • 98 in Accountancy',
        college: 'Loyola College, Chennai',
        avatarColor: 'from-amber-500 to-amber-600',
      },
      {
        name: 'Aditya Birla',
        score: '96.5%',
        grade: '12th Board',
        highlights: '97 in Business Studies • 96 in Accountancy',
        college: 'Sydenham College of Commerce',
        avatarColor: 'from-indigo-500 to-indigo-600',
      },
      {
        name: 'Nisha Pillai',
        score: '95.8%',
        grade: '12th Board',
        highlights: '96 in Economics • 95 in Statistics',
        college: 'Symbiosis College of Arts & Commerce',
        avatarColor: 'from-violet-500 to-violet-600',
      },
    ],
  };

  // Gallery items
  const galleryItems = [
    {
      category: 'CLASSROOMS',
      title: 'Smart Interactive Commerce Classroom',
      subtitle: 'Air-conditioned modern audio-visual lecture hall with high-resolution projection and comfortable seating.',
      tag: 'Campus Infrastructure',
      bgGradient: 'from-indigo-900 to-slate-900',
      icon: Building,
    },
    {
      category: 'EVENTS',
      title: 'Annual Board Achievers Felicitation',
      subtitle: 'Celebrating 95%+ rankers and scholarship award winners with parents and guest Chartered Accountants.',
      tag: 'Awards Ceremony',
      bgGradient: 'from-amber-900 to-slate-900',
      icon: Trophy,
    },
    {
      category: 'FACULTY',
      title: 'Dedicated 1-on-1 Faculty Doubt Clinic',
      subtitle: 'Daily scheduled personal doubt solving tables with senior Accountancy and Economics educators.',
      tag: 'Mentorship',
      bgGradient: 'from-violet-900 to-slate-900',
      icon: Users,
    },
    {
      category: 'CLASSROOMS',
      title: 'Commerce Library & Quiet Study Lounge',
      subtitle: 'Over 2,500 reference titles, board question banks, solved past papers, and silent revision cubicles.',
      tag: 'Library',
      bgGradient: 'from-emerald-900 to-slate-900',
      icon: BookOpen,
    },
    {
      category: 'EVENTS',
      title: 'CUET Domain Orientation & Mock Hall',
      subtitle: 'Real-time computerized mock testing simulating the exact exam conditions of National Testing Agency.',
      tag: 'Exam Hall',
      bgGradient: 'from-blue-900 to-slate-900',
      icon: Award,
    },
    {
      category: 'FACULTY',
      title: 'Board Answer Sheet Review Workshop',
      subtitle: 'Examiners dissecting actual board mark schemes to train students on step-marking and presentation.',
      tag: 'Masterclass',
      bgGradient: 'from-rose-900 to-slate-900',
      icon: Lightbulb,
    },
  ];

  const filteredGallery =
    galleryFilter === 'ALL'
      ? galleryItems
      : galleryItems.filter((item) => item.category === galleryFilter);

  // FAQs
  const faqs = [
    {
      q: 'Which boards and curricula are covered in your batches?',
      a: 'We provide specialized coaching for CBSE, State Boards (Maharashtra, Gujarat, and other state boards), and ISC. Our faculty teaches according to the precise NCERT and respective board syllabus blueprints.',
    },
    {
      q: 'What happens if a student misses a lecture due to school exams or illness?',
      a: 'All lecture notes, chapter summaries, formula sheets, and practice assignments are permanently backed up in each student\'s LMS portal. Students can also attend the weekly faculty doubt clinic to cover missed topics.',
    },
    {
      q: 'How are parents kept informed of academic progress and attendance?',
      a: 'We believe in 100% transparency. Daily attendance is recorded electronically. Parents receive monthly attendance analytics and report cards of weekly diagnostic unit tests through SMS and the parent portal.',
    },
    {
      q: 'Do you also provide coaching for the CUET (Common University Entrance Test)?',
      a: 'Yes! For 12th Commerce students, our board curriculum integrates CUET domain training in Accountancy, Business Studies, and Economics, ensuring students achieve top percentiles for premier university admissions.',
    },
    {
      q: 'What is the batch size and faculty student ratio?',
      a: 'Every cohort is strictly capped at a maximum of 40 students. This guarantees that teachers can interact with each student directly during numerical solving and classroom discussion.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{settings.bannerNotice || 'Academic Year 2026-2027'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                {settings.heroTitle ? (
                  settings.heroTitle
                ) : (
                  <>
                    Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Commerce</span> with Top Faculty
                  </>
                )}
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {settings.heroSubtitle ||
                  'Specialized classroom coaching & digital LMS platform for Accountancy, Economics, Business Studies, and Statistics.'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                {/* Conditionally display Admission button */}
                {settings.showAdmissions && (
                  <Link
                    to="/admission"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-center flex items-center justify-center space-x-2"
                  >
                    <span>Apply for Admission</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}

                {/* Conditionally display Courses button */}
                {settings.showCourses ? (
                  <Link
                    to="/courses"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-base hover:bg-slate-50 hover:border-slate-400 transition-all text-center"
                  >
                    Explore Course Syllabus
                  </Link>
                ) : (
                  <Link
                    to="/about"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-base hover:bg-slate-50 hover:border-slate-400 transition-all text-center"
                  >
                    About Our Academy
                  </Link>
                )}
              </div>

              {/* Key Trust Metrics */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/80">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">98.4%</p>
                  <p className="text-xs text-slate-500 font-medium">Board Pass Rate</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">15+ Yrs</p>
                  <p className="text-xs text-slate-500 font-medium">Faculty Experience</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">1,200+</p>
                  <p className="text-xs text-slate-500 font-medium">Alumni</p>
                </div>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">{settings.instituteShortName} Batches</h2>
                      <p className="text-xs text-slate-500">CBSE & State Board Curricula</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Active
                  </span>
                </div>

                <div className="py-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900 text-sm">Board Preparation Series</span>
                      <span className="text-xs font-semibold text-indigo-600">Morning & Evening</span>
                    </div>
                    <p className="text-xs text-slate-600">Partnership Accounts, Macroeconomics & CUET Prep.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900 text-sm">Commerce Foundation</span>
                      <span className="text-xs font-semibold text-slate-500">Foundation Batch</span>
                    </div>
                    <p className="text-xs text-slate-600">Double-entry bookkeeping, Microeconomics & Statistics.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center text-xs text-slate-600 space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Weekly chapter tests & live doubt clearing</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-600 space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Online student portal for notes & assignments</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-600 space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Parent performance reports & attendance tracking</span>
                  </div>
                </div>

                {settings.showAdmissions && (
                  <div className="mt-6">
                    <Link
                      to="/admission"
                      className="block w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-center font-bold text-sm transition-colors"
                    >
                      Enquire Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Previous Years Results & Hall of Fame (NEW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Proven Track Record of Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Previous Years' Board Results & Rankers
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Consistent top percentiles year after year. Meet our alumni who mastered commerce concepts and joined India's
            premier colleges.
          </p>
        </div>

        {/* Results Metrics Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-10 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-amber-400">98.6%</p>
            <p className="text-xs text-slate-300 mt-1 font-medium">Highest Board Percentage</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">42+</p>
            <p className="text-xs text-slate-300 mt-1 font-medium">Students Scored 95% & Above</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">18</p>
            <p className="text-xs text-slate-300 mt-1 font-medium">Perfect 100/100 in Accountancy</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-300">100%</p>
            <p className="text-xs text-slate-300 mt-1 font-medium">SRCC & Top College Converts</p>
          </div>
        </div>

        {/* Year Filter Tabs */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          {(['2025', '2024', '2023'] as const).map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                selectedYear === year
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Class of {year} Results
            </button>
          ))}
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resultsData[selectedYear].map((student, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-extrabold flex items-center space-x-1">
                    <Medal className="w-3.5 h-3.5" />
                    <span>Ranker #{idx + 1}</span>
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{student.grade}</span>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${student.avatarColor} text-white font-extrabold text-base flex items-center justify-center shadow-md`}
                  >
                    {student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                      {student.name}
                    </h3>
                    <p className="text-2xl font-extrabold text-indigo-600">{student.score}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700">
                    {student.highlights}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Admitted To:</span>
                <span className="font-semibold text-slate-800">{student.college}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 4-Step Academic Mastery Roadmap (NEW) */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Our Proven Pedagogy</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">4-Step Road to Board Perfection</p>
            <p className="mt-3 text-slate-400 text-sm">
              We replace memorization with systematic concept visualization and rigorous exam presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 font-extrabold text-xl flex items-center justify-center">
                01
              </div>
              <h3 className="font-bold text-lg text-white">Concept First</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visualizing transactions and microeconomic behavior from real corporate balance sheets rather than dry rules.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 font-extrabold text-xl flex items-center justify-center">
                02
              </div>
              <h3 className="font-bold text-lg text-white">Numerical Drills</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Solving 300+ numerical problem variations for each unit with step-by-step working notes and journal formatting.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 font-extrabold text-xl flex items-center justify-center">
                03
              </div>
              <h3 className="font-bold text-lg text-white">Weekly Diagnostics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Saturday diagnostic quizzes highlighting weak conceptual areas with instant computerized scoring and feedback.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 font-extrabold text-xl flex items-center justify-center">
                04
              </div>
              <h3 className="font-bold text-lg text-white">Board Mock Series</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                10 full-syllabus 3-hour mock board exams checked by senior board examiners with point-by-point remarking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Campus Infrastructure & Learning Gallery (NEW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Image className="w-4 h-4 text-indigo-600" />
            <span>Campus Life & Learning Environment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Center Infrastructure & Gallery
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Take a visual tour through our smart lecture facilities, student study lounges, and annual ceremonies.
          </p>
        </div>

        {/* Gallery Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'ALL', label: 'All Photos & Spaces' },
            { id: 'CLASSROOMS', label: 'Classrooms & Labs' },
            { id: 'EVENTS', label: 'Annual Events & Awards' },
            { id: 'FACULTY', label: 'Doubt Clinics & Seminars' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setGalleryFilter(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                galleryFilter === cat.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                {/* Visual Banner Tile */}
                <div className={`h-48 bg-gradient-to-tr ${item.bgGradient} p-6 flex flex-col justify-between text-white relative overflow-hidden`}>
                  <div className="flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider">
                      {item.tag}
                    </span>
                    <Icon className="w-6 h-6 text-white/80 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="z-10">
                    <h3 className="font-extrabold text-lg text-white leading-tight">{item.title}</h3>
                  </div>
                  {/* Subtle decorative circles */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                </div>

                <div className="p-6">
                  <p className="text-xs text-slate-600 leading-relaxed">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Flagship Courses Section (Conditional on Admin Toggles) */}
      {(settings.showCourses || settings.showGrade11 || settings.showGrade12) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Our Specialized Programs</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Commerce Curricula & Batches
            </p>
            <p className="mt-4 text-slate-600 text-base">
              Specialized coaching to build conceptual clarity and high marks in board examinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 11th Commerce */}
            {settings.showGrade11 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl transition-shadow flex flex-col justify-between">
                <div>
                  <div className="inline-flex px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-4">
                    Class 11
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">11th Commerce Foundation Program</h3>
                  <p className="text-sm text-slate-600 mb-6">
                    Transition smoothly into Commerce with crystal-clear conceptual clarity in double-entry bookkeeping,
                    economic models, and business organization basics.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-slate-700 space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span>Financial Accounting: Journal to Balance Sheet mastery</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-700 space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span>Microeconomics: Consumer behavior & production theory</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-700 space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span>Statistics for Economics with graphical representation</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Course Duration</span>
                    <span className="font-bold text-slate-800 text-sm">12 Months (Full Year)</span>
                  </div>
                  <Link
                    to="/courses/11-commerce"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-indigo-600 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* 12th Commerce */}
            {settings.showGrade12 && (
              <div className="bg-white rounded-3xl p-8 border-2 border-indigo-500 shadow-lg relative flex flex-col justify-between">
                <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold uppercase tracking-wider shadow">
                  Most Popular
                </div>

                <div>
                  <div className="inline-flex px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-4">
                    Class 12
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">12th Commerce Board & CUET Excellence</h3>
                  <p className="text-sm text-slate-600 mb-6">
                    High-intensity board preparation designed to maximize 95%+ scores in CBSE and state boards, integrated
                    with CUET domain-specific mock exams.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-slate-700 space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Partnership, Company Accounts & Cash Flow Statements</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-700 space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Macroeconomics & Indian Economic Development</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-700 space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>10+ Full Syllabus Board Mock Exams with evaluations</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Course Duration</span>
                    <span className="font-bold text-slate-800 text-sm">12 Months + Mock Series</span>
                  </div>
                  <Link
                    to="/courses/12-commerce"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. Why Choose Us */}
      <section className="bg-slate-50 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">The Academic Advantage</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">Why Students & Parents Choose {settings.instituteShortName}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Small Batch Sizes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict limits per batch ensure individual attention, direct questions, and personal mentoring.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">LMS Portal Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                24/7 access to curated study notes, past papers, homework submission, and online quizzes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Continuous Assessment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Weekly tests and instant diagnostic reporting so students identify weak chapters well in advance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Expert Faculty</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Learn accounting and economics directly from qualified professionals and experienced educators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Student Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Student Testimonials</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">Proven Words by Our Alumni</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "Accountancy always felt overwhelming until I joined. Faculty broke down Partnership journal entries
              into simple principles. Scored 98/100 in board exams!"
            </p>
            <div>
              <p className="font-bold text-slate-900 text-sm">Priya Sharma</p>
              <p className="text-xs text-indigo-600 font-medium">98.6% in 12th Commerce (CBSE)</p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "The online LMS made revision so easy. I could access chapter notes from my phone and take practice
              quizzes before every exam."
            </p>
            <div>
              <p className="font-bold text-slate-900 text-sm">Devansh Mehta</p>
              <p className="text-xs text-indigo-600 font-medium">SRCC Admission, Delhi University</p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "As a parent, I loved the transparency. I received updates on attendance and weekly test results. The
              mentors really care about student progress."
            </p>
            <div>
              <p className="font-bold text-slate-900 text-sm">Mr. R. Singhania</p>
              <p className="text-xs text-indigo-600 font-medium">Parent of Rohan (Commerce Batch)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions (FAQ) (NEW) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="mt-2 text-slate-500 text-sm">Everything you need to know about our commerce batches and admissions.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-indigo-600 flex-shrink-0 ml-4 transform transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-3xl p-10 md:p-16 text-white text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-2xl mx-auto">
            Ready to Excel in Your Commerce Journey?
          </h2>
          <p className="text-indigo-100 max-w-xl mx-auto text-base">
            Reach out to our academic counselor or connect on WhatsApp for guidance.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            {settings.showAdmissions && (
              <Link
                to="/admission"
                className="px-8 py-3.5 rounded-xl bg-white text-indigo-700 font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg"
              >
                Fill Admission Enquiry Form
              </Link>
            )}
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-xl border border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Contact Our Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
