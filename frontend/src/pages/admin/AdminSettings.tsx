import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Settings, Save, CheckCircle2, ShieldCheck, Eye, EyeOff, Sparkles, Phone, Mail, MapPin } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, isLoading } = useSettings();

  const [formData, setFormData] = useState({
    instituteName: '',
    instituteShortName: '',
    tagline: '',
    phone: '',
    email: '',
    address: '',
    whatsappNumber: '',
    showGrade11: false,
    showGrade12: false,
    showAdmissions: false,
    heroTitle: '',
    heroSubtitle: '',
    bannerNotice: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        instituteName: settings.instituteName || '',
        instituteShortName: settings.instituteShortName || '',
        tagline: settings.tagline || '',
        phone: settings.phone || '',
        email: settings.email || '',
        address: settings.address || '',
        whatsappNumber: settings.whatsappNumber || '',
        showGrade11: !!settings.showGrade11,
        showGrade12: !!settings.showGrade12,
        showAdmissions: !!settings.showAdmissions,
        heroTitle: settings.heroTitle || '',
        heroSubtitle: settings.heroSubtitle || '',
        bannerNotice: settings.bannerNotice || '',
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');

    const success = await updateSettings(formData);
    if (success) {
      setSuccessMsg('Settings and navigation visibility updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
    }
    setIsSaving(false);
  };

  const toggleOption = (key: 'showGrade11' | 'showGrade12' | 'showAdmissions') => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Website & System Controls</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Control public visibility of admission & course tabs, and manage institute branding details.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Navigation & Page Feature Toggles */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              <span>Public Page & Navigation Visibility</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Toggle these options on to display the corresponding tabs and pages to visitors. When toggled off, they are hidden from the menu and direct URL access is locked.
            </p>
          </div>

          <div className="space-y-4">
            {/* Toggle: Admissions */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 text-sm">Admission Enquiry Tab & Page (`/admission`)</p>
                <p className="text-xs text-slate-500">
                  Enables the online enquiry form and 'Enroll Now' buttons on the website.
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleOption('showAdmissions')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.showAdmissions ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    formData.showAdmissions ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle: 11th Commerce */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 text-sm">11th Commerce Showcase</p>
                <p className="text-xs text-slate-500">
                  Shows 11th Commerce features on the public home page and footer.
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleOption('showGrade11')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.showGrade11 ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    formData.showGrade11 ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle: 12th Commerce */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 text-sm">12th Commerce Showcase</p>
                <p className="text-xs text-slate-500">
                  Shows 12th Commerce features on the public home page and footer.
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleOption('showGrade12')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.showGrade12 ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    formData.showGrade12 ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Institute Branding & Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Institute Identity & Contact Information</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Customize the tuition center name, logo text, contact numbers, and address dynamically.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Full Institute Name *</label>
              <input
                type="text"
                required
                value={formData.instituteName}
                onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                placeholder="e.g. Apex Commerce Academy"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Short Name (Navbar Logo) *</label>
              <input
                type="text"
                required
                value={formData.instituteShortName}
                onChange={(e) => setFormData({ ...formData, instituteShortName: e.target.value })}
                placeholder="e.g. Apex Commerce"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1.5">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. 11th & 12th Commerce Excellence"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Phone Hotline</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">WhatsApp Number</label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="919876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@academy.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1.5">Physical Campus Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2 disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
