import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Users,
  Flame,
  Clock,
  MessageSquare,
  Play,
  Pause,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  LogOut,
  Target
} from 'lucide-react';
import { StudyRoom, StudyRoomParticipant } from '../../types/study';
import { UserAccountSettings } from '../../types';

interface StudyRoomsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: StudyRoom[];
  settings: UserAccountSettings;
  onShowToast: (msg: string) => void;
}

export const StudyRoomsModal: React.FC<StudyRoomsModalProps> = ({
  isOpen,
  onClose,
  rooms,
  settings,
  onShowToast
}) => {
  const [activeRoomId, setActiveRoomId] = useState<string>(rooms[0]?.id || '');
  const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null);
  const [myFocusGoal, setMyFocusGoal] = useState<string>('Synthesizing Algorithms Chapter 4');
  const [sprintRunning, setSprintRunning] = useState<boolean>(true);
  const [sprintMinutes, setSprintMinutes] = useState<number>(25);

  if (!isOpen) return null;

  const currentRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

  const handleJoinRoom = (roomId: string) => {
    setJoinedRoomId(roomId);
    setActiveRoomId(roomId);
    onShowToast(`Joined study room: "${rooms.find(r => r.id === roomId)?.name}"`);
  };

  const handleLeaveRoom = () => {
    setJoinedRoomId(null);
    onShowToast('Left study room');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-sans overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col h-[85vh] max-h-[800px] overflow-hidden text-white"
        >
          {/* Top Bar */}
          <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black border border-neutral-700 flex items-center justify-center text-white shrink-0">
                <Users className="w-5 h-5 text-neutral-300" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white block">
                  COLLABORATIVE LIVE STUDY LOUNGE
                </span>
                <span className="text-[11px] text-neutral-400">
                  Synchronous Co-Presence • Peer Accountability • Shared Sprints
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Two-Pane Body */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            {/* Left Pane: Available Rooms List (35%) */}
            <div className="w-full md:w-80 border-r border-neutral-800 bg-[#090909] p-4 space-y-3 overflow-y-auto shrink-0 font-mono">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-bold uppercase px-1">
                <span>Active Study Rooms</span>
                <span>{rooms.length} Live</span>
              </div>

              <div className="space-y-2">
                {rooms.map(room => {
                  const isSelected = room.id === currentRoom?.id;
                  const isJoined = joinedRoomId === room.id;

                  return (
                    <div
                      key={room.id}
                      onClick={() => setActiveRoomId(room.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-[#141414] border-neutral-600 ring-1 ring-neutral-500'
                          : 'bg-[#0e0e0e] border-neutral-850 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                          {room.roomMode}
                        </span>
                        {isJoined && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                            Joined
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-1">
                        {room.name}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-850">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-neutral-500" />
                          {room.participants.length} Scholars
                        </span>
                        <span>{room.sprintMinutesRemaining}m left</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Pane: Active Room Stage & Co-Presence Deck (65%) */}
            <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto bg-[#070707]">
              {currentRoom && (
                <>
                  {/* Room Header Card with Synchronous Sprint Timer */}
                  <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4 font-mono">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                          Room Topic: {currentRoom.topic}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {currentRoom.name}
                        </h3>
                      </div>

                      {joinedRoomId === currentRoom.id ? (
                        <button
                          type="button"
                          onClick={handleLeaveRoom}
                          className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Leave Room</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleJoinRoom(currentRoom.id)}
                          className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-bold flex items-center gap-1.5 shadow"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Join Study Room</span>
                        </button>
                      )}
                    </div>

                    {/* Synchronous Sprint Clock Bar */}
                    <div className="p-3.5 rounded-xl bg-black border border-neutral-850 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-neutral-400" />
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                            Shared Sprint Interval
                          </span>
                          <span className="text-base font-bold text-white">
                            {sprintMinutes}:00 Remaining
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSprintRunning(prev => !prev)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 border border-neutral-800"
                      >
                        {sprintRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{sprintRunning ? 'Focusing' : 'Paused'}</span>
                      </button>
                    </div>

                    {/* Student Goal Input */}
                    {joinedRoomId === currentRoom.id && (
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[10px] text-neutral-400 uppercase font-bold flex items-center gap-1">
                          <Target className="w-3 h-3 text-emerald-400" />
                          <span>Your Active Study Intention:</span>
                        </label>
                        <input
                          type="text"
                          value={myFocusGoal}
                          onChange={e => setMyFocusGoal(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black border border-neutral-800 text-white text-xs outline-none focus:border-neutral-600 font-sans"
                        />
                      </div>
                    )}
                  </div>

                  {/* Co-Presence Scholars Roster */}
                  <div className="space-y-3 font-mono">
                    <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-neutral-400" />
                      <span>Scholars in Room ({currentRoom.participants.length + (joinedRoomId === currentRoom.id ? 1 : 0)})</span>
                    </span>

                    <div className="space-y-2">
                      {/* Self Card (if joined) */}
                      {joinedRoomId === currentRoom.id && (
                        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/80 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-900/60 border border-emerald-700 text-emerald-200 flex items-center justify-center text-xs font-bold">
                              {settings.username.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">
                                @{settings.username} (You)
                              </span>
                              <span className="text-[10px] text-neutral-400 font-sans block">
                                Goal: {myFocusGoal}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-900/40 border border-emerald-700/50">
                            Active Flow
                          </span>
                        </div>
                      )}

                      {/* Other Room Participants */}
                      {currentRoom.participants.map(part => (
                        <div
                          key={part.id}
                          className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-850 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-300 flex items-center justify-center text-xs font-bold">
                              {part.avatar}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">
                                {part.name}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-sans block">
                                Goal: {part.focusGoal}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] text-neutral-400 px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">
                            {part.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
