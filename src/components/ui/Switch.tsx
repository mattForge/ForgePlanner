// components/ui/Switch.tsx
import React from 'react';

export function Switch({ checked, onCheckedChange, ...props }) {
  return (
    <button
      className={`w-12 h-6 rounded-full transition-all duration-200 relative ${
        checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
      onClick={() => onCheckedChange(!checked)}
      {...props}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 shadow-sm ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
