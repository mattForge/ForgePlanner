import React, { useState, useEffect } from 'react';
import { ClockInOut } from '../components/time/ClockInOut';
import { TimeChart } from '../components/time/TimeChart';
import { Card } from '../components/ui/Card';
import {
  Calendar as CalendarIcon,
  Download,
  Clock,
  Play,
  Square,
  TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../hooks/useAuth';
import { TeamSelector } from '../components/admin/TeamSelector';

export function TimeTracking() {
  const { timeRecords, addTimeRecord, updateTimeRecord, users, teams } = useData();
  const { currentUser } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    currentUser?.role === 'admin' ? 'all' : currentUser?.teamIds[0] || ''
  );
  
  // ✅ LIVE TIMER STATE
  const activeSession = timeRecords.find(
    (r) => r.userId === currentUser?.id && !r.clockOut
  );
  const [liveDuration, setLiveDuration] = useState(0);

  // ✅ LIVE TIMER - Updates every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession) {
      interval = setInterval(() => {
        const start = new Date(activeSession.clockIn);
        const duration = Math.round((Date.now() - start.getTime()) / 1000 / 60);
        setLiveDuration(duration);
      }, 1000);
    } else {
      setLiveDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const handleClockAction = () => {
    if (activeSession) {
      // Clock Out - Use live duration
      const duration = liveDuration || Math.round((Date.now() - new Date(activeSession.clockIn).getTime()) / 1000 / 60);
      updateTimeRecord(activeSession.id, {
        clockOut: new Date().toISOString(),
        duration
      });
    } else {
      // Clock In
      if (!currentUser?.teamIds[0]) return alert('No team assigned');
      addTimeRecord({
        userId: currentUser.id,
        teamId: currentUser.teamIds[0],
        clockIn: new Date().toISOString(),
        clockOut: null,
        duration: 0
      });
    }
  };

  // Filter records for display (LIVE)
  const filteredRecords = timeRecords
    .filter((r) => {
      const matchesTeam = selectedTeamId === 'all' || r.teamId === selectedTeamId;
      const matchesUser = currentUser?.role === 'admin' ? true : r.userId === currentUser?.id;
      return matchesTeam && matchesUser;
    })
    .sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime());

  // Calculate LIVE stats
  const totalMinutes = filteredRecords.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const totalHours = Math.round(totalMinutes / 60 * 10) / 10;
  
  // Today & Week stats
  const todayRecords = filteredRecords.filter(record => {
    const recordDate = new Date(record.clockIn);
    const today = new Date();
    return recordDate.toDateString() === today.toDateString();
  });
  const todayHours = Math.round(todayRecords.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 60 * 10) / 10;

  const weekRecords = filteredRecords.filter(record => {
    const recordDate = new Date(record.clockIn);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return recordDate > weekAgo;
  });
  const weekHours = Math.round(weekRecords.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 60 * 10) / 10;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Time Tracking
          </h1>
          <p className="text-gray-500 mt-1">
            Live tracking • <span className="font-semibold">{totalHours}h</span> total • Updated {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-3">
          {currentUser?.role === 'admin' && (
            <TeamSelector
              selectedTeamId={selectedTeamId}
              onTeamChange={setSelectedTeamId}
            />
          )}
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LIVE Clock Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 text-center border-2 border-dashed">
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-4 uppercase tracking-wide">Status</div>
              <div className={`text-3xl font-bold mb-2 ${
                activeSession 
                  ? 'text-green-600 animate-pulse' 
                  : 'text-gray-400'
              }`}>
                {activeSession ? '● LIVE' : '○ IDLE'}
              </div>
              {activeSession && (
                <div className="space-y-1">
                  <div className="text-xl font-bold text-gray-900">
                    {Math.floor(liveDuration / 60)}h {liveDuration % 60}m
                  </div>
                  <div className="text-sm text-gray-500">
                    Since {new Date(activeSession.clockIn).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
            </div>

            <Button
              size="lg"
              className={`w-full gap-2 px-8 py-6 text-lg font-semibold transition-all ${
                activeSession 
                  ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200' 
                  : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200'
              }`}
              onClick={handleClockAction}
            >
              {activeSession ? (
                <>
                  <Square className="w-5 h-5" />
                  Clock Out
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Clock In Now
                </>
              )}
            </Button>
          </Card>

          {/* LIVE Recent Sessions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent ({filteredRecords.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredRecords.slice(0, 5).map((record) => {
                const user = users.find((u) => u.id === record.userId);
                const team = teams.find((t) => t.id === record.teamId);
                return (
                  <Card key={record.id} className="p-4 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        {currentUser?.role === 'admin' && (
                          <div className="text-xs font-bold text-blue-600 mb-1">{user?.name}</div>
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(record.clockIn).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2 text-xs text-gray-500 items-center">
                          <span>{new Date(record.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>•</span>
                          <span>{record.clockOut 
                            ? new Date(record.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Live'
                          }</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">
                          {record.duration 
                            ? `${Math.floor(record.duration / 60)}h ${record.duration % 60}m`
                            : `${Math.floor(liveDuration / 60)}h ${liveDuration % 60}m`
                          }
                        </div>
                        {team && (
                          <div className="text-xs text-gray-500 mt-1">{team.name}</div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
              {filteredRecords.length === 0 && (
                <Card className="p-8 text-center text-gray-500">
                  No time records yet
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* LIVE Charts & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <TimeChart records={filteredRecords} /> {/* ✅ Pass live data */}

          {/* LIVE Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Total Hours
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalHours}h</div>
            </Card>
            
            <Card className="p-6">
              <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Today
              </div>
              <div className="text-3xl font-bold text-blue-600">{todayHours}h</div>
            </Card>
            
            <Card className="p-6">
              <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                This Week
              </div>
              <div className="text-3xl font-bold text-green-600">{weekHours}h</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
