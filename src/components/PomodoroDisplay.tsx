import React, { useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { usePomodoro } from '../hooks/usePomodoro';

interface PomodoroDisplayProps {
  onShowToast?: (msg: string) => void;
  isDark?: boolean;
}

/**
 * Isolated Pomodoro timer display component.
 * Timer state is completely isolated from parent (WorkspaceView),
 * preventing unnecessary re-renders when timer ticks.
 * This component re-renders independently on timer updates.
 */
export const PomodoroDisplay: React.FC<PomodoroDisplayProps> = ({ onShowToast, isDark = true }) => {
  const pomodoro = usePomodoro(1500); // 25 minutes default

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = useCallback(() => {
    pomodoro.start();
    onShowToast?.('Focus session started. Good luck! 🎯');
  }, [pomodoro, onShowToast]);

  const handlePause = useCallback(() => {
    pomodoro.pause();
    onShowToast?.('Focus session paused.');
  }, [pomodoro, onShowToast]);

  const handleReset = useCallback(() => {
    pomodoro.reset();
    onShowToast?.('Timer reset.');
  }, [pomodoro, onShowToast]);

  const isTimeUp = pomodoro.timeRemaining <= 0;

  return (
    <div
      className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
        isDark
          ? 'bg-neutral-900 border-neutral-800'
          : 'bg-neutral-100 border-neutral-300'
      }`}
    >
      {/* Timer Display */}
      <div
        className={`text-4xl font-mono font-bold tabular-nums transition-colors ${
          isTimeUp
            ? isDark
              ? 'text-red-400'
              : 'text-red-600'
            : isDark
            ? 'text-white'
            : 'text-black'
        }`}
      >
        {formatTime(pomodoro.timeRemaining)}
      </div>

      {/* Phase Label */}
      <div
        className={`text-xs font-mono uppercase tracking-wider ${
          isDark ? 'text-neutral-500' : 'text-neutral-600'
        }`}
      >
        {pomodoro.phase === 'work' ? '🎯 Focus' : '☕ Break'}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        {!pomodoro.isRunning ? (
          <button
            onClick={handleStart}
            className={`p-2 rounded transition-colors ${
              isDark
                ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                : 'bg-green-100 hover:bg-green-200 text-green-700'
            }`}
            title="Start focus session"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>
        ) : (
          <button
            onClick={handlePause}
            className={`p-2 rounded transition-colors ${
              isDark
                ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
            }`}
            title="Pause focus session"
          >
            <Pause className="w-4 h-4 fill-current" />
          </button>
        )}

        <button
          onClick={handleReset}
          className={`p-2 rounded transition-colors ${
            isDark
              ? 'bg-neutral-700 hover:bg-neutral-600 text-neutral-300'
              : 'bg-neutral-300 hover:bg-neutral-400 text-neutral-700'
          }`}
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-neutral-700 rounded-full overflow-hidden mt-2">
        <div
          className={`h-full transition-all duration-100 ${
            isTimeUp ? 'bg-red-500' : 'bg-green-500'
          }`}
          style={{
            width: `${((pomodoro.totalTime - pomodoro.timeRemaining) / pomodoro.totalTime) * 100}%`
          }}
        />
      </div>
    </div>
  );
};
