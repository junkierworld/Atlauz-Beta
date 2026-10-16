import { useState, useEffect, useCallback, useRef } from 'react';

export interface PomodoroState {
  isRunning: boolean;
  timeRemaining: number;
  totalTime: number;
  phase: 'work' | 'break';
}

export interface UsePomodoroReturn extends PomodoroState {
  start: () => void;
  pause: () => void;
  reset: () => void;
  setDuration: (seconds: number) => void;
}

/**
 * Custom hook for managing Pomodoro timer state in isolation.
 * This separates timer logic from the main WorkspaceView component,
 * preventing unnecessary re-renders of the entire workspace when timer ticks.
 */
export function usePomodoro(initialSeconds: number = 1500): UsePomodoroReturn {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [totalTime, setTotalTime] = useState(initialSeconds);
  const [phase, setPhase] = useState<'work' | 'break'>('work');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // Main timer loop - uses timestamp delta to avoid drift
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const delta = Math.floor((now - lastTickRef.current) / 1000);
      lastTickRef.current = now;

      if (delta > 0) {
        setTimeRemaining(prev => Math.max(0, prev - delta));
      }
    }, 100); // Check every 100ms for more accurate timing

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Persist to localStorage whenever timer changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      try {
        localStorage.setItem(
          'pomodoro_state',
          JSON.stringify({ timeRemaining, isRunning, totalTime, phase })
        );
      } catch (e) {
        console.warn('Failed to persist timer state:', e);
      }
    }, 500); // Debounce writes to avoid excessive localStorage calls

    return () => clearTimeout(debounceTimer);
  }, [timeRemaining, isRunning, totalTime, phase]);

  const start = useCallback(() => {
    lastTickRef.current = Date.now();
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(totalTime);
    lastTickRef.current = Date.now();
  }, [totalTime]);

  const setDuration = useCallback((seconds: number) => {
    setTotalTime(seconds);
    setTimeRemaining(seconds);
    setIsRunning(false);
  }, []);

  return {
    isRunning,
    timeRemaining,
    totalTime,
    phase,
    start,
    pause,
    reset,
    setDuration
  };
}
