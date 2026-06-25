import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string | Date;
  onExpire?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference <= 0) {
        setTimeLeft(prev => ({ ...prev, isExpired: true }));
        if (onExpire) onExpire();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400">
        Departure Passed
      </span>
    );
  }

  return (
    <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
      <div className="bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.5 rounded">{timeLeft.days}d</div>
      <span>:</span>
      <div className="bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.5 rounded">{timeLeft.hours}h</div>
      <span>:</span>
      <div className="bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.5 rounded">{timeLeft.minutes}m</div>
      <span>:</span>
      <div className="bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.5 rounded">{timeLeft.seconds}s</div>
    </div>
  );
};
