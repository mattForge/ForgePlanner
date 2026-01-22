// src/components/time/TimeChart.tsx - CORRECTED VERSION
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card } from '../ui/Card';
import { Clock } from 'lucide-react';

interface TimeChartProps {
  records: Array<{
    id: string;
    userId: string;
    teamId: string;
    clockIn: string;
    clockOut: string | null;
    duration: number;
  }>;
}

export function TimeChart({ records }: TimeChartProps) {
  const data = useMemo(() => {
    const dayHours: { [key: string]: number } = {};
    
    records.forEach(record => {
      const date = new Date(record.clockIn);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      dayHours[dayName] = (dayHours[dayName] || 0) + (record.duration / 60);
    });

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      hours: Math.round((dayHours[day] || 0) * 10) / 10
    }));
  }, [records]);

  const totalHours = data.reduce((sum, day) => sum + day.hours, 0);
  const getBarColor = (hours: number) => hours > 8 ? '#3B82F6' : '#93C5FD';

  return (
    <Card className="h-full min-h-[450px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 p-6 border-b">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Weekly Activity</h3>
          </div>
          <p className="text-sm text-gray-500">Live hours tracked this week</p>
        </div>
        <div className="text-2xl font-bold text-blue-600 mt-2 sm:mt-0">
          {Math.round(totalHours * 10) / 10}h
        </div>
      </div>

      <div className="h-[350px] w-full px-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" strokeOpacity={0.8} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip
              cursor={{ fill: '#F9FAFB' }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                fontSize: '14px'
              }}
              formatter={(value: number) => [`${value.toFixed(1)}h`, 'Hours']}
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Bar dataKey="hours" radius={[4, 4, 0, 0]} barSize={42} maxBarSize={50}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.hours)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ FIXED LEGEND - Line 146 */}
      <div className="p-6 pt-4 border-t bg-gray-50/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-gray-700 font-medium">Normal Day</span>
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            {/* ✅ FIXED: Use &gt; instead of > */}
            <span className="text-gray-700 font-medium">Overtime (&gt;8h)</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">{data.length} days tracked</div>
            <div className="text-xs text-gray-500">
              Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
