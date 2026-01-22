import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Save, ChevronLeft, Clock, Calendar, 
  Globe, Bell, Shield, Database, Palette, Trash2 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { Card } from '../components/ui/Card';
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
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('appSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  // Apply theme immediately
  useEffect(() => {
    const theme = settings.theme === 'system' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : settings.theme;
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [settings.theme]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ 
      ...prev, 
      [key]: value 
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    setSaving(true);
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      setHasChanges(false);
      // Trigger custom event for other components
      window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settings }));
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
    document.documentElement.classList.remove('dark');
    setHasChanges(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Customize your TeamFlow experience
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button 
            variant="outline" 
            onClick={resetSettings}
            className="border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            disabled={saving}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Reset All
          </Button>
          <Button 
            onClick={saveSettings} 
            disabled={!hasChanges || saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {hasChanges ? 'Save Changes' : 'Saved'}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appearance & Display */}
        <Card className="lg:col-span-1">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Palette className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Appearance</h2>
            </div>

            {/* Theme Selector */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Theme Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: null }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleSettingChange('theme', value)}
                      className={`p-4 rounded-xl border-2 transition-all group ${
                        settings.theme === value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />}
                        <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  System follows your OS preference
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Language / Region
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="en">English (Default)</option>
                  <option value="af">Afrikaans</option>
                  <option value="zu">isiZulu</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Time & Date Settings */}
        <Card className="lg:col-span-1">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Date & Time</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Time Format
                </label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="24h">24-hour • 14:30</option>
                  <option value="12h">12-hour • 2:30 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="dd/mm/yyyy">DD/MM/YYYY • 22/01/2026</option>
                  <option value="mm/dd/yyyy">MM/DD/YYYY • 01/22/2026</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD • 2026-01-22</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Africa/Johannesburg">SAST (GMT+2) • Johannesburg</option>
                  <option value="Europe/London">GMT/BST • London</option>
                  <option value="America/New_York">EST/EDT • New York</option>
                  <option value="UTC">UTC • Coordinated Universal</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="lg:col-span-2">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Bell className="w-8 h-8 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications & Behavior</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Browser Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Daily summaries and clock-in reminders
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Auto Clock-Out</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Automatically end sessions after idle time
                  </p>
                </div>
                <Switch
                  checked={settings.autoClockOut}
                  onCheckedChange={(checked) => handleSettingChange('autoClockOut', checked)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Idle Timeout
                </label>
                <select
                  value={settings.idleTimeout}
                  onChange={(e) => handleSettingChange('idleTimeout', parseInt(e.target.value))}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value={0}>Disabled</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy & Data */}
        <Card className="lg:col-span-2">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy & Data</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Local usage data to improve TeamFlow
                  </p>
                </div>
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
                />
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Clear All Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Delete timesheets, teams, and settings (irreversible)
                </p>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                  onClick={() => {
                    if (confirm('Delete ALL data? This cannot be undone.')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  Clear Everything
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Bar */}
      <Card>
        <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <div>
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                {hasChanges ? 'Unsaved changes detected' : 'All settings up to date'}
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-200">
                Settings are saved locally and sync across browser sessions
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

