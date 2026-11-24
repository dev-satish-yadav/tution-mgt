import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            Visit Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Contact & Center Location</h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            Our tuition center is centrally located with dedicated air-conditioned smart classrooms and student library.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Tuition Center Campus</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              402 Apex Towers, Commerce Plaza, MG Road, Fort, Mumbai - 400001
            </p>
            <p className="text-xs text-indigo-600 font-semibold">2 mins walking from Metro Station</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Call or WhatsApp</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Counseling Hotline: +91 98765 43210
              <br />
              Academic Support: +91 98200 11223
            </p>
            <div>
              <a
                href="https://wa.me/919876543210?text=Hello%20Apex%20Commerce"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Office Working Hours</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monday to Saturday: 8:00 AM - 7:30 PM
              <br />
              Sunday (Mock Tests): 9:00 AM - 1:00 PM
            </p>
            <p className="text-xs text-slate-400">Counselors available all days</p>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Interactive Location Map</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Easily accessible from major suburban trains and metro stations. Parking available in the basement.
          </p>
          <div className="h-64 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-medium border border-slate-200">
            [Google Maps Embedded View: Apex Towers, MG Road, Mumbai]
          </div>
        </div>
      </section>
    </div>
  );
};
