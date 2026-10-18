import React, { useState } from 'react';
import { Bell, Palette, Lock, Globe, Info, ChevronRight, Check } from 'lucide-react';

export const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary">
          App Settings
        </h1>
        <p className="text-sm text-text-secondary">
          Customize your appraisal workspace preferences
        </p>
      </div>

      {/* Settings Options Card */}
      <div className="bg-white border-2 border-border-light rounded-3xl p-6 shadow-sm divide-y divide-border-light">

        {/* Notifications Toggle */}
        <div className="py-4 flex items-center justify-between first:pt-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-pastel text-primary flex items-center justify-center">
              <Bell size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">Push Notifications</p>
              <p className="text-xs text-text-secondary">Alerts when AI appraisals finish calculating</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-border-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        {/* Dark Mode Toggle */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-yellow-pastel text-accent-orange flex items-center justify-center">
              <Palette size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">Appearance Theme</p>
              <p className="text-xs text-text-secondary">{darkMode ? 'Dark Theme' : 'Light Memphis Theme'}</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-border-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        {/* Cloud Auto-Sync */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-orange-pastel text-accent-orange flex items-center justify-center">
              <Lock size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">Cloud Auto-Sync</p>
              <p className="text-xs text-text-secondary">Sync valuations to Google Cloud Run automatically</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-border-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        {/* Language & Currency */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
              <Globe size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">Currency & Region</p>
              <p className="text-xs text-text-secondary">Philippine Peso (PHP ₱) • Metric (sqm)</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-text-muted" />
        </div>

        {/* About & System Info */}
        <div className="py-4 flex items-center justify-between last:pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-background-main text-text-secondary flex items-center justify-center">
              <Info size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">Valyou Web Application</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">
            Up to date
          </span>
        </div>

      </div>

    </div>
  );
};

export default Settings;
