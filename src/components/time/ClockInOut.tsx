import React, { useEffect, useState } from 'react';
import { Play, Square } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
export function ClockInOut() {
  const [time, setTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isClockedIn && sessionStart) {
      interval = setInterval(() => {
        setElapsed(
          Math.floor((new Date().getTime() - sessionStart.getTime()) / 1000)
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, sessionStart]);
  const handleClockIn = () => {
    setIsClockedIn(true);
    setSessionStart(new Date());
  };
  const handleClockOut = () => {
    setIsClockedIn(false);
    setSessionStart(null);
    setElapsed(0);
  };
  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  return (
    <Card className="flex flex-col items-center justify-center py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

      <div className="text-center mb-8">
        <h2 className="text-gray-500 font-medium mb-2">Current Time</h2>
        <div className="text-5xl font-bold text-gray-900 font-mono tracking-wider">
          {time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        <div className="text-gray-400 mt-2 text-sm">
          {time.toLocaleDateString([], {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <AnimatePresence mode="wait">
          {!isClockedIn ?
          <motion.div
            key="clock-in"
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.9
            }}>

              <Button
              size="lg"
              className="w-48 h-16 text-lg gap-2 shadow-lg shadow-blue-200"
              onClick={handleClockIn}>

                <Play className="w-5 h-5 fill-current" />
                Clock In
              </Button>
            </motion.div> :

          <motion.div
            key="clock-out"
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.9
            }}
            className="flex flex-col items-center gap-4">

              <div className="text-2xl font-mono font-medium text-blue-600 bg-blue-50 px-6 py-2 rounded-full">
                {formatElapsed(elapsed)}
              </div>
              <Button
              variant="outline"
              size="lg"
              className="w-48 h-16 text-lg gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
              onClick={handleClockOut}>

                <Square className="w-5 h-5 fill-current" />
                Clock Out
              </Button>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </Card>);

}