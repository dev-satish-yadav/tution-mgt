import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/axios';
import { WebsiteSettings } from '../types';

interface SettingsContextType {
  settings: WebsiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<boolean>;
}

const defaultSettings: WebsiteSettings = {
  instituteName: 'Apex Commerce Academy',
  instituteShortName: 'Apex Commerce',
  tagline: '11th & 12th Commerce Excellence',
  phone: '+91 98765 43210',
  email: 'admissions@apexcommerce.edu',
  address: '402 Apex Towers, Commerce Plaza, MG Road, Mumbai - 400001',
  whatsappNumber: '919876543210',
  showGrade11: false,
  showGrade12: false,
  showAdmissions: false,
  heroTitle: 'Master Commerce with Top Board Rankers',
  heroSubtitle: 'Specialized coaching & digital LMS platform for Accountancy, Economics, Business Studies, and Statistics.',
  bannerNotice: 'Admissions Open for Academic Year 2026-2027',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/website/settings');
      if (response.data.success && response.data.data) {
        setSettings(response.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch website settings, using defaults', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<WebsiteSettings>): Promise<boolean> => {
    try {
      const response = await api.patch('/website/settings', newSettings);
      if (response.data.success && response.data.data) {
        setSettings(response.data.data);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update website settings', err);
      return false;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: fetchSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
