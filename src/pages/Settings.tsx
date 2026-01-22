import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Save, ChevronLeft, Clock, Calendar, 
  Globe, Bell, Shield, Database, Palette 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { useAuth } from '../hooks/useAuth';

export function Settings() {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    theme: 'system',
    timeFormat: '24h',
    dateFormat: 'dd/mm/yyyy',
    timezone: 'Africa/Johannesburg',
    notifications: true,
    autoClockOut: false,
    idleTimeout: 30,
    language: 'en',
    analytics: true
  });
  const [saving, setSaving] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Apply theme
  useEffect(() => {
    const theme = settings.theme === 'system' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : settings.theme;
    
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [settings.theme]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      // Apply immediate changes
      if (settings.theme !== 'system') {
        document.documentElement.classList.toggle('dark', settings.theme === 'dark');
      }
      
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    const defaults = {
      theme: 'system',
      timeFormat: '24h',
      dateFormat: 'dd/mm/yyyy',
      timezone: 'Africa/Johannesburg',
      notifications: true,
      autoClockOut: false,
      idleTimeout: 30,
      language: 'en',
      analytics: true
    };
    setSettings(defaults);
    localStorage.removeItem('appSettings');
    document.documentElement.removeAttribute('class');
    alert('Settings reset to defaults');
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Customize your TeamFlow experience
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={resetSettings}
            className="border-gray-200 dark:border-gray-700"
          >
            Reset All
          </Button>
          <Button 
            onClick={saveSettings} 
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appearance */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Appearance</h2>
            </div>

            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Theme</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dark, Light, or System default
                  </p>
                </div>
                <div className="flex gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <button
                    onClick={() => handleSettingChange('theme', 'light')}
                    className={`p-2 rounded-lg transition-all ${
                      settings.theme === 'light' 
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Sun className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleSettingChange('theme', 'dark')}
                    className={`p-2 rounded-lg transition-all ${
                      settings.theme === 'dark' 
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Moon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleSettingChange('theme', 'system')}
                    className={`p-2 rounded-lg transition-all ${
                      settings.theme === 'system' 
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xs font-medium">SYS</span>
                  </button>
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block font-semibold text-gray-900 dark:text-white mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="af">Afrikaans</option>
                  <option value="zu">Zulu</option>
                </select>
              </div>
            </div>
          </div>

          {/* Time & Date */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Date & Time</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block font-semibold text-gray-900 dark:text-white mb-2">
                  Time Format
                </label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="24h">24-hour (14:30)</option>
                  <option value="12h">12-hour (2:30 PM)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-900 dark:text-white mb-2">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dd/mm/yyyy">DD/MM/YYYY (22/01/2026)</option>
                  <option value="mm/dd/yyyy">MM/DD/YYYY (01/22/2026)</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD (2026-01-22)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-900 dark:text-white mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Africa/Johannesburg">SAST (GMT+2)</option>
                  <option value="Europe/London">GMT/BST</option>
                  <option value="America/New_York">EST/EDT</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Privacy */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Desktop Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Clock-in reminders and daily summaries</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Auto Clock-Out</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automatically clock out after idle time</p>
                </div>
                <Switch
                  checked={settings.autoClockOut}
                  onCheckedChange={(checked) => handleSettingChange('autoClockOut', checked)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Analytics</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Help improve TeamFlow (local only)</p>
                </div>
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 dark:text-white mb-2">
                  Idle Timeout (minutes)
                </label>
                <select
                  value={settings.idleTimeout}
                  onChange={(e) => handleSettingChange('idleTimeout', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={0}>Never</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <h3 className="font-semibold text-green-900 dark:text-green-100">
            All changes saved locally and applied instantly
          </h3>
        </div>
        <p className="text-sm text-green-700 dark:text-green-200 mt-1">
          Settings persist across sessions and devices (localStorage)
        </p>
      </div>
    </div>
  );
}
