import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  ShieldCheck,
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  Layers,
  ChevronDown,
  Info,
  Award,
  Waves,
  Maximize2
} from 'lucide-react';
import { CognitiveTelemetry } from '../types';

export type IcebergTimeframe = 'weeks' | 'months' | 'year';

export interface StreakDayRecord {
  id: string;
  dateStr: string;
  dayNumber: number;
  dayOfWeek: string;
  isFreeze: boolean;
  hasStreak: boolean;
  studyMinutes: number;
  focusSessions: number;
  bubblesCount: number;
  depthMeters: number;
  zoneName: 'Sunlight Epipelagic' | 'Twilight Mesopelagic' | 'Midnight Bathypelagic' | 'Abyssal Zone' | 'Hadal Trench';
  note?: string;
}

interface StreakIcebergVisualizerProps {
  telemetry: CognitiveTelemetry;
  onShowToast: (msg: string) => void;
}

export const StreakIcebergVisualizer: React.FC<StreakIcebergVisualizerProps> = ({
  telemetry,
  onShowToast
}) => {
  const [timeframe, setTimeframe] = useState<IcebergTimeframe>('weeks');
  const [selectedDay, setSelectedDay] = useState<StreakDayRecord | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'streaks' | 'freezes'>('all');

  // Generate realistic, consistent historical streak data based on timeframe
  const historyData: StreakDayRecord[] = useMemo(() => {
    const daysCount = timeframe === 'weeks' ? 28 : timeframe === 'months' ? 90 : 180;
    const records: StreakDayRecord[] = [];
    const today = new Date('2026-10-02');

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);

      // Freeze days occur periodically on recovery blocks (e.g. day index mod 7 == 6 or specific breaks)
      const dayIndex = daysCount - i;
      const isFreeze = dayIndex % 8 === 0 || dayIndex === 14 || dayIndex === 42 || dayIndex === 77;
      const hasStreak = !isFreeze || dayIndex > 10;
      const depth = dayIndex * 45; // 45 meters per consecutive day into the deep

      let zone: StreakDayRecord['zoneName'] = 'Sunlight Epipelagic';
      if (depth > 6000) zone = 'Hadal Trench';
      else if (depth > 4000) zone = 'Abyssal Zone';
      else if (depth > 1000) zone = 'Midnight Bathypelagic';
      else if (depth > 200) zone = 'Twilight Mesopelagic';

      const studyMinutes = isFreeze ? 0 : Math.floor(45 + (Math.sin(i) * 20 + 35));
      const sessions = isFreeze ? 0 : Math.max(1, Math.floor(studyMinutes / 25));
      const bubbles = isFreeze ? 0 : Math.min(8, Math.max(2, Math.floor(studyMinutes / 15)));

      records.push({
        id: `day-${dayIndex}`,
        dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dayNumber: dayIndex,
        dayOfWeek: dayNames[d.getDay()],
        isFreeze,
        hasStreak,
        studyMinutes,
        focusSessions: sessions,
        bubblesCount: bubbles,
        depthMeters: depth,
        zoneName: zone,
        note: isFreeze
          ? 'Academic Freeze Activated: Protected rest day preventing cognitive fatigue.'
          : `${studyMinutes}m active study with ${sessions} deep focus pomodoros logged.`
      });
    }

    return records;
  }, [timeframe]);

  const filteredDays = useMemo(() => {
    if (filterType === 'streaks') return historyData.filter(d => !d.isFreeze);
    if (filterType === 'freezes') return historyData.filter(d => d.isFreeze);
    return historyData;
  }, [historyData, filterType]);

  // Aggregate stats
  const totalActiveDays = historyData.filter(d => !d.isFreeze).length;
  const totalFreezeDays = historyData.filter(d => d.isFreeze).length;
  const totalStudyHours = (historyData.reduce((acc, d) => acc + d.studyMinutes, 0) / 60).toFixed(1);
  const maxDepthReached = historyData[historyData.length - 1]?.depthMeters || 1200;
  const consistencyRate = Math.round((totalActiveDays / historyData.length) * 100);

  // Height of mountain peak above water based on current uninterrupted streak
  const streakMountainHeight = Math.min(100, Math.max(30, telemetry.streakDays * 3.2));

  return (
    <div className="flex flex-col space-y-4 font-sans select-none">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-black border border-neutral-700 flex items-center justify-center text-cyan-300 shrink-0 shadow-inner">
            <span className="text-xl">🏔️</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-sm sm:text-base font-bold text-white uppercase tracking-tight">
                Streak History Iceberg
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-750 text-cyan-300 font-bold">
                {telemetry.streakDays}d Active Pile
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Visualizes uninterrupted study momentum above water and hadal depth endurance below
            </p>
          </div>
        </div>

        {/* Timeframe Selector & Filter Strip */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center bg-black p-1 rounded-lg border border-neutral-800">
            {(['weeks', 'months', 'year'] as IcebergTimeframe[]).map(tf => (
              <button
                key={tf}
                onClick={() => {
                  setTimeframe(tf);
                  setSelectedDay(null);
                  onShowToast(`Viewing ${tf === 'weeks' ? 'Last 4 Weeks' : tf === 'months' ? 'Last 3 Months' : 'Full Academic Year'} Iceberg`);
                }}
                className={`min-touch-target px-3 py-1 rounded transition-all capitalize text-xs ${
                  timeframe === tf
                    ? 'bg-white text-black font-bold ring-1 ring-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ICEBERG VISUAL CANVAS STAGE */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#06111e] via-[#040a14] to-[#02050a] border border-neutral-800 p-4 sm:p-6 overflow-hidden shadow-2xl">
        {/* Sky / Atmospheric Background Grid */}
        <div className="absolute inset-0 bg-prototype-grid opacity-10 pointer-events-none" />

        {/* Section 1: Above Waterline (The Ice Peak Mountain of Streak) */}
        <div className="relative z-10 flex flex-col items-center pb-6 border-b-2 border-dashed border-cyan-400/40">
          <div className="flex items-center justify-between w-full text-[11px] font-mono text-cyan-300/80 mb-2">
            <span className="flex items-center gap-1.5 uppercase tracking-wider font-bold">
              <span>☀️</span> Sea Level 0m • Streak Mountain Peak
            </span>
            <span className="text-neutral-400">
              Height: +{streakMountainHeight}m ({telemetry.streakDays} Consecutive Days)
            </span>
          </div>

          {/* Iceberg Peak Geometry */}
          <div className="relative w-full max-w-lg flex flex-col items-center justify-center my-2">
            {/* Glowing Peak Mountain SVG */}
            <div
              style={{ height: `${streakMountainHeight + 40}px` }}
              className="w-48 sm:w-64 relative flex items-center justify-center transition-all duration-500"
            >
              <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-[0_0_25px_rgba(0,242,254,0.35)]">
                <defs>
                  <linearGradient id="icePeakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#bbf2f6" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#48cae4" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="iceFacetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0077b6" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* Mountain Facets */}
                <polygon points="100,8 30,115 100,115" fill="url(#icePeakGrad)" />
                <polygon points="100,8 170,115 100,115" fill="url(#iceFacetGrad)" />
                <polygon points="100,8 80,65 100,115" fill="#ffffff" opacity="0.3" />

                {/* Crystalline Cracks */}
                <line x1="100" y1="20" x2="90" y2="55" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
                <line x1="90" y1="55" x2="110" y2="85" stroke="#ffffff" strokeWidth="1.2" opacity="0.5" />
              </svg>

              {/* Floating Oxygen Bubbles inside Mountain */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <span className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/90 animate-ping" />
                <span className="absolute top-8 left-1/3 w-1.5 h-1.5 rounded-full bg-cyan-200/80 animate-pulse" />
                <span className="absolute top-12 right-1/3 w-2 h-2 rounded-full bg-white/70 animate-bounce" />
              </div>

              {/* Peak Floating Badge */}
              <div className="absolute -top-3 px-3 py-1 rounded-full bg-black/85 border border-cyan-400 text-white font-mono text-[10px] font-bold shadow-lg flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300" />
                <span>{telemetry.streakDays}d Streak Summit</span>
              </div>
            </div>

            <p className="text-[11px] text-cyan-200/70 font-mono text-center max-w-xs mt-1">
              Active streaks pile into a rising mountain of ice with trapped oxygen bubbles from daily deep study.
            </p>
          </div>

          {/* Waterline Barrier Indicator */}
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-cyan-400/90 pt-3">
            <span className="flex items-center gap-1">
              <Waves className="w-3.5 h-3.5" /> WATERLINE BOUNDARY (0 METERS)
            </span>
            <span className="text-neutral-400">
              Scroll down to inspect deep submerged strata ↓
            </span>
          </div>
        </div>

        {/* Section 2: Submerged Deep Iceberg Strata (Scrollable Historical Depth) */}
        <div className="relative z-10 pt-4 space-y-3">
          {/* Depth Legend & Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded border text-[11px] ${
                  filterType === 'all'
                    ? 'bg-neutral-800 border-white text-white font-bold'
                    : 'bg-black/50 border-neutral-800 text-neutral-400'
                }`}
              >
                All Days ({historyData.length})
              </button>
              <button
                onClick={() => setFilterType('streaks')}
                className={`px-2.5 py-1 rounded border text-[11px] flex items-center gap-1.5 ${
                  filterType === 'streaks'
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                    : 'bg-black/50 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-300 inline-block" />
                <span>Streak Ice ({totalActiveDays})</span>
              </button>
              <button
                onClick={() => setFilterType('freezes')}
                className={`px-2.5 py-1 rounded border text-[11px] flex items-center gap-1.5 ${
                  filterType === 'freezes'
                    ? 'bg-blue-950 border-blue-400 text-blue-200 font-bold'
                    : 'bg-black/50 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                <span>Academic Freezes ({totalFreezeDays})</span>
              </button>
            </div>

            <span className="text-[11px] text-neutral-400">
              Max Depth: <strong className="text-white">-{maxDepthReached}m</strong>
            </span>
          </div>

          {/* Scrollable Ice Strata Grid */}
          <div className="max-h-[340px] overflow-y-auto no-scrollbar p-1 space-y-2 rounded-xl bg-black/60 border border-neutral-800/80">
            {filteredDays.map((day, idx) => {
              const isSelected = selectedDay?.id === day.id;

              return (
                <div
                  key={day.id}
                  onClick={() => setSelectedDay(day)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    day.isFreeze
                      ? isSelected
                        ? 'bg-blue-900/60 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                        : 'bg-blue-950/40 border-blue-800/80 hover:border-blue-500'
                      : isSelected
                      ? 'bg-cyan-900/60 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                      : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-600'
                  }`}
                >
                  {/* Left: Day & Depth Stratum */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border font-mono text-xs font-bold ${
                        day.isFreeze
                          ? 'bg-blue-900/80 border-blue-400 text-blue-200 shadow-[inset_0_0_8px_rgba(59,130,246,0.6)]'
                          : 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[inset_0_0_8px_rgba(6,182,212,0.6)]'
                      }`}
                    >
                      {day.isFreeze ? '🛡️' : '🧊'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          Day {day.dayNumber} • {day.dateStr}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          ({day.dayOfWeek})
                        </span>
                        {day.isFreeze ? (
                          <span className="px-1.5 py-0.2 rounded bg-blue-900/80 text-blue-300 border border-blue-700 text-[9px] font-mono font-bold uppercase">
                            Academic Freeze
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 text-[9px] font-mono font-bold uppercase">
                            {day.bubblesCount} Bubbles
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 mt-0.5">
                        <span className="text-cyan-400/90 font-semibold">-{day.depthMeters}m</span>
                        <span>•</span>
                        <span>{day.zoneName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Study Metrics & Bubble Particles */}
                  <div className="flex items-center gap-3 justify-between sm:justify-end font-mono text-xs">
                    {day.isFreeze ? (
                      <div className="flex items-center gap-1 text-blue-300 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>Protected Rest Block</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold tabular-nums">
                          {day.studyMinutes}m
                        </span>
                        <span className="text-neutral-500 text-[10px]">
                          ({day.focusSessions} {day.focusSessions === 1 ? 'session' : 'sessions'})
                        </span>

                        {/* Interactive Bubbles Indicator */}
                        <div className="flex items-center gap-0.5 ml-1">
                          {Array.from({ length: Math.min(5, day.bubblesCount) }).map((_, bIdx) => (
                            <span
                              key={bIdx}
                              title="Oxygen study bubble trapped in ice"
                              className="w-2 h-2 rounded-full bg-cyan-300/80 border border-white/60 animate-pulse inline-block"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Day Detail Inspector Callout */}
          {selectedDay && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-black border border-cyan-400/50 space-y-2 font-mono text-xs text-neutral-300 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{selectedDay.isFreeze ? '🛡️' : '🧊'}</span>
                  <span className="font-bold text-white text-sm">
                    {selectedDay.dateStr} (Day {selectedDay.dayNumber})
                  </span>
                  <span className="text-neutral-500">[{selectedDay.zoneName}]</span>
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-neutral-500 hover:text-white"
                >
                  [Close]
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase">Ice Type</span>
                  <span className={`font-bold ${selectedDay.isFreeze ? 'text-blue-300' : 'text-cyan-300'}`}>
                    {selectedDay.isFreeze ? 'Academic Freeze (Blue)' : 'Bubble-Infused Streak'}
                  </span>
                </div>
                <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase">Submerged Depth</span>
                  <span className="font-bold text-white">-{selectedDay.depthMeters} meters</span>
                </div>
                <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase">Logged Focus</span>
                  <span className="font-bold text-white">{selectedDay.studyMinutes} minutes</span>
                </div>
                <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase">Oxygen Bubbles</span>
                  <span className="font-bold text-cyan-300">{selectedDay.bubblesCount} trapped</span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-400 italic pt-1">
                {selectedDay.note}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* SUMMARY OF HISTORY STATS DOCK */}
      <div className="p-4 sm:p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 font-sans">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-300" />
            Historical Streak & Iceberg Metrics ({timeframe.toUpperCase()})
          </span>
          <span className="text-neutral-400">Updated from Local Vault</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          {/* Stat 1: Total Study Hours */}
          <div className="p-3 rounded-lg bg-black border border-neutral-800 flex flex-col justify-between">
            <span className="text-[11px] text-neutral-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-500" /> Total Focus
            </span>
            <div className="mt-2">
              <span className="text-lg sm:text-xl font-bold text-white tabular-nums">
                {totalStudyHours}h
              </span>
              <span className="text-[10px] text-neutral-500 block">Across {totalActiveDays} Active Days</span>
            </div>
          </div>

          {/* Stat 2: Current Streak Peak */}
          <div className="p-3 rounded-lg bg-black border border-neutral-800 flex flex-col justify-between">
            <span className="text-[11px] text-cyan-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-cyan-400" /> Mountain Peak
            </span>
            <div className="mt-2">
              <span className="text-lg sm:text-xl font-bold text-cyan-200 tabular-nums">
                {telemetry.streakDays} Days
              </span>
              <span className="text-[10px] text-cyan-400/80 block">Uninterrupted Momentum</span>
            </div>
          </div>

          {/* Stat 3: Freezes Redeemed */}
          <div className="p-3 rounded-lg bg-black border border-neutral-800 flex flex-col justify-between">
            <span className="text-[11px] text-blue-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Blue Ice Freezes
            </span>
            <div className="mt-2">
              <span className="text-lg sm:text-xl font-bold text-blue-200 tabular-nums">
                {totalFreezeDays} Days
              </span>
              <span className="text-[10px] text-blue-400/80 block">Fatigue Prevented</span>
            </div>
          </div>

          {/* Stat 4: Max Depth Level */}
          <div className="p-3 rounded-lg bg-black border border-neutral-800 flex flex-col justify-between">
            <span className="text-[11px] text-neutral-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-neutral-500" /> Deep Depth
            </span>
            <div className="mt-2">
              <span className="text-lg sm:text-xl font-bold text-white tabular-nums">
                -{maxDepthReached}m
              </span>
              <span className="text-[10px] text-neutral-500 block">{consistencyRate}% Consistency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
