// hooks/useSettings.ts
import { useState, useEffect } from 'react';

export function useSettings() {
  const [settings, setSettings] = useState({
    theme: 'system',
    timeFormat: '24h',
    dateFormat: 'dd/mm/yyyy',
    timezone: 'Africa/Johannesburg',
  });

  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('settingsUpdated', (e: any) => {
      setSettings(e.detail);
    });
  }, []);

  return settings;
}
