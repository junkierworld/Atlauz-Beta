import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Snowflake,
  Clock,
  Moon,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { RestDayVaultEntry, CognitiveTelemetry } from '../types';

interface RestDaysVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: CognitiveTelemetry;
  restDays: RestDayVaultEntry[];
  onToggleStreakFreeze: () => void;
  onAddRestDay: (entry: RestDayVaultEntry) => void;
  onShowToast: (msg: string) => void;
  settings?: { theme?: 'light' | 'dark' };
}

export const RestDaysVaultModal: React.FC<RestDaysVaultModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  restDays,
  onToggleStreakFreeze,
  onAddRestDay,
  onShowToast,
  settings
}) => {
  const isDark = settings?.theme === 'dark';
  const [newLabel, setNewLabel] = useState('');
  const [newSleepHours, setNewSleepHours] = useState('8.0');
  const [newWellnessHours, setNewWellnessHours] = useState('2.5');
  const [newNotes, setNewNotes] = useState('');

  if (!isOpen) return null;

  const handleCreateRestBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const entry: RestDayVaultEntry = {
      id: `rest-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      triggerType: 'manual_schedule',
      label: newLabel.trim(),
      protectedStreakDay: telemetry.streakDays,
      sleepHours: parseFloat(newSleepHours) || 8.0,
      wellnessHours: parseFloat(newWellnessHours) || 2.0,
      status: 'protected',
      notes: newNotes.trim() || 'Manual recovery block scheduled to prevent burnout.'
    };

    onAddRestDay(entry);
    setNewLabel('');
    setNewNotes('');
    onShowToast(`Rest day recorded: Streak protected at Day ${telemetry.streakDays}`);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none animate-fade-in ${isDark ? 'bg-black/80' : 'bg-white/60'}`}>
      <div className={`w-full max-w-2xl rounded-lg p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar ${isDark ? 'bg-neutral-900 border border-neutral-700 text-white' : 'bg-neutral-50 border border-neutral-300 text-black'}`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-neutral-800 border border-neutral-700 text-white">
              <Snowflake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono uppercase tracking-tight">
                  Rest Days Vault & Streak Freeze
                </h3>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold uppercase">
                  ANTI-BURNOUT
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Rest and recovery reframed as structural metrics without punitive streak resets.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white font-mono text-xs p-1"
          >
            [X]
          </button>
        </div>

        {/* ACTIVE FREEZE STATUS HERO TILE (WITH DIAGONAL CROSS-HATCH PATTERN) */}
        <div
          className={`rounded-lg p-4 sm:p-5 border transition-all duration-300 relative overflow-hidden ${
            telemetry.isStreakFrozen
              ? 'bg-freeze-pattern bg-neutral-950 border-neutral-700 backdrop-blur-[20px]'
              : 'bg-neutral-950 border-neutral-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span
                  className={`font-bold px-2 py-0.5 rounded border uppercase text-[10px] ${
                    telemetry.isStreakFrozen
                      ? 'bg-white text-black border-white'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-700'
                  }`}
                >
                  {telemetry.isStreakFrozen ? '[STREAK FROZEN]' : '[STREAK FLOW ACTIVE]'}
                </span>
                <span className={telemetry.isStreakFrozen ? 'text-[#888888]' : 'text-neutral-300'}>
                  {telemetry.streakDays} Consecutive Days Logged
                </span>
              </div>

              <h4
                className={`text-lg sm:text-xl font-bold font-mono tracking-tight ${
                  telemetry.isStreakFrozen ? 'text-[#888888]' : 'text-white'
                }`}
              >
                {telemetry.isStreakFrozen
                  ? 'Cognitive Anti-Burnout Lock Engaged'
                  : 'Active Flow State Protected'}
              </h4>

              <p
                className={`text-xs leading-relaxed max-w-md ${
                  telemetry.isStreakFrozen ? 'text-[#888888]' : 'text-neutral-400'
                }`}
              >
                {telemetry.isStreakFrozen
                  ? 'Tile resting in locked 20px blur with wireframe cross-hatch overlay. Rest and circadian balance logged as successful recovery.'
                  : 'Streak incrementing normally. Triggering a freeze will preserve your habit score while resting.'}
              </p>
            </div>

            <button
              onClick={() => {
                onToggleStreakFreeze();
                onShowToast(
                  !telemetry.isStreakFrozen
                    ? 'Streak Frozen: Cross-hatch wireframe applied'
                    : 'Streak Resumed into Active Flow'
                );
              }}
              className={`px-4 py-2 rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shrink-0 ${
                telemetry.isStreakFrozen
                  ? 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-600'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
              title={telemetry.isStreakFrozen ? 'Your habit streak is paused. Your count is protected during rest.' : 'Temporarily freeze your streak to prevent it from breaking during scheduled rest or recovery periods.'}
            >
              <Snowflake className="w-3.5 h-3.5" />
              <span>{telemetry.isStreakFrozen ? 'Resume Active Flow' : 'Freeze Streak Today'}</span>
            </button>
          </div>
        </div>

        {/* REST DAYS VAULT LEDGER TABLE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-neutral-400 pb-1 border-b border-neutral-800">
            <span className="font-bold text-white uppercase">Protected Rest Days Ledger</span>
            <span>{restDays.length} Recoveries Protected</span>
          </div>

          <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-neutral-900 border-b border-neutral-800 text-[10px] text-neutral-400 uppercase">
                <tr>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Recovery Reason</th>
                  <th className="p-2.5">Sleep Log</th>
                  <th className="p-2.5">Protected Streak</th>
                  <th className="p-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-300 text-xs">
                {restDays.map(entry => (
                  <tr key={entry.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="p-2.5 text-white font-medium whitespace-nowrap">{entry.date}</td>
                    <td className="p-2.5">
                      <div className="font-bold text-white text-[11px]">{entry.label}</div>
                      <div className="text-[10px] text-neutral-500 font-sans truncate max-w-xs">{entry.notes}</div>
                    </td>
                    <td className="p-2.5 whitespace-nowrap text-neutral-400">
                      {entry.sleepHours}h Sleep / {entry.wellnessHours}h Rest
                    </td>
                    <td className="p-2.5 whitespace-nowrap font-bold text-white">
                      Day {entry.protectedStreakDay}
                    </td>
                    <td className="p-2.5 text-right whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 text-[9px] uppercase font-bold">
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule a New Rest Day */}
        <form onSubmit={handleCreateRestBlock} className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2.5 font-mono text-xs">
          <span className="font-bold text-white uppercase text-[11px] block">
            Schedule a Rest / Recovery Day:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder="Recovery Reason (e.g. Field Rest, Post-Symposium)..."
              className="sm:col-span-2 bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white placeholder-neutral-500 outline-none focus:border-white"
            />
            <div className="flex gap-2">
              <input
                type="number"
                step="0.5"
                value={newSleepHours}
                onChange={e => setNewSleepHours(e.target.value)}
                placeholder="Sleep hrs"
                className="w-1/2 bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-white placeholder-neutral-500 outline-none focus:border-white text-center"
              />
              <button
                type="submit"
                className="w-1/2 px-3 py-1.5 rounded bg-white text-black font-bold flex items-center justify-center gap-1 hover:bg-neutral-200 transition-all"
              >
                <Plus className="w-3 h-3" />
                <span>Log</span>
              </button>
            </div>
          </div>
        </form>

        <div className="pt-2 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
