import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios';
import { useSettings } from '../../context/SettingsContext';
import { CheckCircle2, Sparkles, Send, ShieldCheck, Lock, Phone } from 'lucide-react';

const enquirySchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number'),
  grade: z.enum(['11th', '12th']),
  schoolName: z.string().optional(),
  message: z.string().optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export const AdmissionPage: React.FC = () => {
  const { settings } = useSettings();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validation: If admissions option is disabled by Teacher / Admin, show closed state
  if (!settings.showAdmissions) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admissions Currently Closed</h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Public online admission enquiries are currently inactive. Please contact the tuition administration directly for batch openings.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors"
            >
              Contact Administration
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      grade: '12th',
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await api.post('/enquiries', data);
      if (response.data.success) {
        setIsSuccess(true);
        reset();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            Admissions 2026-2027
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Admission Enquiry & Counseling</h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            Take the first step toward academic excellence. Fill out the form below and our academic counselor will
            reach out to discuss batch options, trial classes, and fee structures.
          </p>
        </div>
      </section>

      {/* Form & Perks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
            {isSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Enquiry Submitted Successfully!</h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for your interest in Apex Commerce Academy. Our academic coordinator will contact you
                  within 24 hours to schedule your free counseling and demo class.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Student Enquiry Form</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Please provide accurate contact details so we can reach you promptly.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-sm border border-rose-200">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('fullName')}
                      placeholder="e.g. Aarav Patel"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="e.g. aarav@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Contact Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Target Grade / Standard *
                    </label>
                    <select
                      {...register('grade')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                    >
                      <option value="12th">12th Commerce (Board Year)</option>
                      <option value="11th">11th Commerce (Foundation)</option>
                    </select>
                    {errors.grade && <p className="text-xs text-rose-600 mt-1">{errors.grade.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current School / Junior College
                  </label>
                  <input
                    type="text"
                    {...register('schoolName')}
                    placeholder="e.g. Delhi Public School / St. Xavier's"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Questions or Specific Subjects of Interest
                  </label>
                  <textarea
                    rows={3}
                    {...register('message')}
                    placeholder="e.g. Interested in Accountancy and Economics batches; would like to attend a demo class this Saturday."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Admission Enquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Perks Side Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-tr from-indigo-900 to-indigo-800 rounded-3xl p-8 text-white space-y-6 shadow-xl">
              <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Admission Benefits</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Why Join Apex Commerce?</h3>

              <div className="space-y-4 text-xs sm:text-sm text-indigo-100">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Complimentary 2-day trial classes with senior faculty</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Complete kit of printed formula sheets and past 10-year question banks</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Immediate access to student LMS portal for recorded notes & quizzes</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Personalized performance tracking & weekly progress SMS to parents</span>
                </div>
              </div>

              <div className="pt-4 border-t border-indigo-700/60 flex items-center space-x-3 text-xs text-indigo-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>No admission fee for merit scholarship students scoring 90%+ in Class 10.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
