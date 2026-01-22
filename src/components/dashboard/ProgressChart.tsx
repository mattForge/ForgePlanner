// Where: src/components/dashboard/ProgressChart.tsx
import React from 'react';
import { CheckCircle, Clock, Square } from 'lucide-react';

interface ProgressData {
  total: number;
  done: number;
  inProgress: number;
}

export function ProgressChart({ data }: { data: ProgressData }) {
  const completion = data.total > 0 ? (data.done / data.total) * 100 : 0;
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Task Progress</h3>
      </div>
      
      {/* Dynamic Progress Bar */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-1000"
            style={{ width: `${completion}%` }}
          />
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">{completion.toFixed(1)}%</span>
        </div>
      </div>
      
      {/* Live Counts */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
        <div className="text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{data.done}</div>
          <div className="text-sm text-gray-500">Done</div>
        </div>
        <div className="text-center">
          <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{data.inProgress}</div>
          <div className="text-sm text-gray-500">In Progress</div>
        </div>
        <div className="text-center">
          <Square className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{data.total - data.done - data.inProgress}</div>
          <div className="text-sm text-gray-500">Todo</div>
        </div>
      </div>
    </div>
  );
}
