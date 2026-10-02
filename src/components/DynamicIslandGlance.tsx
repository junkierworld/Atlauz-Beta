import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Play,
  Pause,
  Snowflake,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Calendar,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight,
  Shield,
  Plus
} from 'lucide-react';
import { CognitiveTelemetry, ScheduleBlock } from '../types';

interface DynamicIslandGlanceProps {
  telemetry: CognitiveTelemetry;
  schedule: ScheduleBlock[];
  onStartFocus: () => void;
  onOpenRestVault: () => void;
  onOpenScrapbook: () => void;
  onShowToast: (msg: string) => void;
}

export const DynamicIslandGlance: React.FC<DynamicIslandGlanceProps> = ({
  telemetry,
  schedule,
  onStartFocus,
  onOpenRestVault,
  onOpenScrapbook,
  onShowToast
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isActiveTimer, setIsActiveTimer] = useState<boolean>(true);
  const [showLongPressActions, setShowLongPressActions] = useState<boolean>(false);
  const [showWidgetGallery, setShowWidgetGallery] = useState<boolean>(false);

  // Timer interval for Live Activity
  useEffect(() => {
    let interval: any = null;
    if (isActiveTimer && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActiveTimer, secondsRemaining]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DYNAMIC ISLAND PILL / LIVE ACTIVITY (Top Center Floating HUD) */}
      {/* ========================================================================= */}
      <div className="fixed top-2 sm:top-3 inset-x-0 z-50 flex flex-col items-center pointer-events-none font-sans select-none">
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={`pointer-events-auto bg-black border border-neutral-700 shadow-2xl text-white overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'w-[94vw] max-w-md rounded-2xl p-4'
              : 'rounded-full px-3.5 py-1.5 flex items-center gap-3 cursor-pointer hover:border-neutral-500'
          }`}
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          {/* COMPACT PILL STATE */}
          {!isExpanded ? (
            <div className="flex items-center gap-2.5 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-bold text-white tracking-wider">{timeFormatted}</span>
              <span className="text-neutral-500">|</span>
              <span className="text-neutral-400 text-[11px] truncate max-w-[120px]">
                COGS-492 Focus
              </span>
              {telemetry.isStreakFrozen && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-neutral-900 border border-neutral-700 text-neutral-400 font-bold">
                  [FROZEN]
                </span>
              )}
              <ChevronDown className="w-3 h-3 text-neutral-500 ml-0.5" />
            </div>
          ) : (
            /* EXPANDED LIVE ACTIVITY GLANCE */
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span className="font-bold text-white uppercase text-[11px]">
                    LIVE ACTIVITY • DEEP SPRINT
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowWidgetGallery(true)}
                    className="text-[10px] text-neutral-400 hover:text-white underline"
                  >
                    View Widgets
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setIsExpanded(false);
                    }}
                    className="p-1 rounded text-neutral-400 hover:text-white"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Live Timer Countdown & State */}
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-widest tabular-nums">
                    {timeFormatted}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Continuous Session Pacing: Zero Attention Residue
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsActiveTimer(!isActiveTimer)}
                    className="p-2 rounded bg-white text-black font-bold hover:bg-neutral-200 transition-all"
                    title={isActiveTimer ? 'Pause Sprint' : 'Resume Sprint'}
                  >
                    {isActiveTimer ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Actions in Island */}
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onStartFocus();
                  }}
                  className="py-1.5 px-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Workspace</span>
                </button>
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenRestVault();
                  }}
                  className="py-1.5 px-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center gap-1"
                >
                  <Snowflake className="w-3 h-3" />
                  <span>Rest Vault</span>
                </button>
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenScrapbook();
                  }}
                  className="py-1.5 px-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Scrapbook</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE WIDGET MODAL (1x1 Small Widget & 2x2 Medium Widget Preview) */}
      {/* ========================================================================= */}
      {showWidgetGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-sans select-none animate-fade-in">
          <div className="w-full max-w-xl bg-neutral-900 border border-neutral-700 rounded-lg p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-white" />
                <h3 className="font-bold text-sm font-mono uppercase">
                  Mobile Home Screen & Lock Screen Widgets
                </h3>
              </div>
              <button
                onClick={() => setShowWidgetGallery(false)}
                className="text-neutral-400 hover:text-white font-mono text-xs"
              >
                [X]
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SMALL WIDGET (1x1 Bento) */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 block">
                  Small Widget (1x1 Bento Tile)
                </span>
                <div className="aspect-square w-full rounded-2xl bg-black border-2 border-neutral-700 p-4 flex flex-col justify-between shadow-lg font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 uppercase">[STREAK]</span>
                    {telemetry.isStreakFrozen && (
                      <span className="text-[9px] px-1 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-white font-bold">
                        [FROZEN]
                      </span>
                    )}
                  </div>

                  <div className="my-auto">
                    <div className="text-4xl font-bold text-white tabular-nums">
                      {telemetry.streakDays}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">Days Protected</div>
                  </div>

                  <button
                    onClick={() => {
                      setShowWidgetGallery(false);
                      onStartFocus();
                      onShowToast('1-Tap Launch: Focus sprint initiated');
                    }}
                    className="w-full py-2 rounded bg-white text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-200 transition-all"
                  >
                    <Play className="w-3 h-3 text-black fill-current" />
                    <span>Focus Now</span>
                  </button>
                </div>
              </div>

              {/* MEDIUM WIDGET (2x2 Bento) */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 block">
                  Medium Widget (2x2 Bento Grid)
                </span>
                <div className="aspect-square w-full rounded-2xl bg-black border-2 border-neutral-700 p-4 flex flex-col justify-between shadow-lg font-mono">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 pb-1 border-b border-neutral-800">
                      <span>DAILY SCHEDULE</span>
                      <span className="text-white font-bold">COGS-492</span>
                    </div>

                    <div className="space-y-1.5 mt-2 text-[10px]">
                      {schedule.slice(0, 3).map(s => (
                        <div key={s.id} className="flex items-center justify-between p-1.5 rounded bg-neutral-950 border border-neutral-800">
                          <span className="text-neutral-300 truncate max-w-[120px]">{s.title}</span>
                          <span className="text-neutral-500 text-[9px]">{s.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                      <span>Daily Goal Progress</span>
                      <span className="text-white font-bold">{telemetry.dailyGoalProgress}%</span>
                    </div>
                    <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                      <div className="bg-white h-full" style={{ width: `${telemetry.dailyGoalProgress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setShowWidgetGallery(false)}
                className="px-4 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
