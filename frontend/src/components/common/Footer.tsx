import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { BookOpen, Phone, Mail, MapPin, MessageSquare, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">{settings.instituteName}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.tagline}. Dedicated learning management platform and coaching center preparing students for board
              and competitive excellence.
            </p>
            {settings.whatsappNumber && (
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi,%20I%20have%20an%20enquiry%20regarding%20batches`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Quick Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About the Academy
                </Link>
              </li>
              {settings.showCourses && (
                <li>
                  <Link to="/courses" className="hover:text-white transition-colors">
                    All Courses
                  </Link>
                </li>
              )}
              {settings.showAdmissions && (
                <li>
                  <Link to="/admission" className="hover:text-white transition-colors">
                    Admission Enquiry Form
                  </Link>
                </li>
              )}
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Location & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Programs (Conditional on flags) */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Commerce Programs</h3>
            <ul className="space-y-2.5 text-sm">
              {settings.showGrade11 && (
                <li>
                  <Link to="/courses/11-commerce" className="hover:text-white transition-colors">
                    11th Commerce Foundation
                  </Link>
                </li>
              )}
              {settings.showGrade12 && (
                <li>
                  <Link to="/courses/12-commerce" className="hover:text-white transition-colors">
                    12th Commerce Board Mastery
                  </Link>
                </li>
              )}
              <li>
                <span className="text-slate-400">Financial & Corporate Accounting</span>
              </li>
              <li>
                <span className="text-slate-400">Micro & Macro Economics</span>
              </li>
              <li>
                <span className="text-slate-400">Business Studies & Management</span>
              </li>
              <li>
                <span className="text-slate-400">CUET Commerce Orientation</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Contact Information</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>{settings.email}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Mon - Sat: 8:00 AM - 7:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.instituteName}. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-6">
            <Link to="/login" className="hover:text-slate-300">
              Student / Teacher Portal
            </Link>
            <Link to="/admin/login" className="hover:text-slate-300">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
