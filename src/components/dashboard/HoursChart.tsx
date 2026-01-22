// Where: src/components/dashboard/HoursChart.tsx
import React from 'react';
import { Clock, TrendingUp } from 'lucide-react';

interface HoursData {
  totalHours: number;
  avgHours: number;
  recentRecords: number;
}

export function HoursChart({ data }: { data: HoursData }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Hours Overview</h3>
        <TrendingUp className="w-6 h-6 text-green-500" />
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {Math.floor(data.totalHours / 60)}h {data.totalHours % 60}m
          </div>
          <div className="text-sm text-gray-500">Total Hours Logged</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <div className="text-lg font-semibold text-gray-900">{data.avgHours}h</div>
            <div className="text-xs text-gray-500">Avg per User</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{data.recentRecords}</div>
            <div className="text-xs text-gray-500">This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
}
