import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileCode,
  Copy,
  Star,
  Pin,
  Maximize2,
  Minimize2,
  X,
  Check,
  ChevronDown
} from 'lucide-react';
import { ResourceItem } from '../types';
import { BadgeSelector } from './BadgeSelector';

interface NotepadViewerProps {
  notepad: ResourceItem;
  onClose: () => void;
  onUpdateNotepad: (updated: Partial<ResourceItem>) => void;
  onShowToast: (msg: string) => void;
}

export const NotepadViewer: React.FC<NotepadViewerProps> = ({
  notepad,
  onClose,
  onUpdateNotepad,
  onShowToast
}) => {
  const [isMaximized, setIsMaximized] = useState(true);
  const [content, setContent] = useState(notepad.metadata.noteContent || '');
  const [copied, setCopied] = useState(false);
  const [showBadgePicker, setShowBadgePicker] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('Notes copied to clipboard');
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    onUpdateNotepad({
      metadata: { ...notepad.metadata, noteContent: val }
    });
  };

  const togglePin = () => {
    const next = !notepad.isPinned;
    onUpdateNotepad({ isPinned: next });
    onShowToast(next ? '📌 Pinned notepad to Hub' : 'Unpinned notepad');
  };

  const toggleFavorite = () => {
    const next = !notepad.isFavorite;
    onUpdateNotepad({ isFavorite: next });
    onShowToast(next ? '⭐ Starred notepad' : 'Removed from Starred');
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-2 bg-black/80 backdrop-blur-md overflow-hidden">
      <motion.div
        layout
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className={`bg-[#0a1529] text-white flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isMaximized
            ? 'w-full h-full rounded-none sm:rounded-xl border border-[#ffb95f]/30'
            : 'w-full max-w-3xl h-[80vh] rounded-2xl border border-[#ffb95f]/40'
        }`}
      >
        {/* Header */}
        <div className="bg-[#081224] border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#ffb95f]/20 text-[#ffb95f] flex items-center justify-center font-bold border border-[#ffb95f]/40">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={notepad.title}
                  onChange={e => onUpdateNotepad({ title: e.target.value })}
                  className="font-bold text-base sm:text-lg bg-transparent border-b border-transparent hover:border-white/30 focus:border-[#ffb95f] outline-none"
                />
                <button onClick={toggleFavorite} className="text-amber-400">
                  <Star className={`w-4 h-4 ${notepad.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button onClick={togglePin} className="text-[#00f2fe]">
                  <Pin className={`w-4 h-4 ${notepad.isPinned ? 'fill-current' : ''}`} />
                </button>

                {/* Badge selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowBadgePicker(!showBadgePicker)}
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ffb95f]/15 text-[#ffb95f] border border-[#ffb95f]/30 flex items-center gap-1"
                  >
                    <span>{notepad.badge || '🌿 Serene'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showBadgePicker && (
                    <div className="absolute top-full left-0 mt-1 z-50">
                      <BadgeSelector
                        currentBadge={notepad.badge}
                        isPinned={notepad.isPinned}
                        isFavorite={notepad.isFavorite}
                        onSelectBadge={b => {
                          onUpdateNotepad({ badge: b });
                          setShowBadgePicker(false);
                          onShowToast(`Badge set to ${b}`);
                        }}
                        onTogglePin={togglePin}
                        onToggleFavorite={toggleFavorite}
                        onClose={() => setShowBadgePicker(false)}
                      />
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs text-white/50">{wordCount} Words • {charCount} Characters</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => {
                setIsMaximized(!isMaximized);
                onShowToast(isMaximized ? 'Minimized' : 'Maximized Clean Clarity View');
              }}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-rose-500/20 text-white/60 hover:text-rose-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col">
          <textarea
            value={content}
            onChange={e => handleContentChange(e.target.value)}
            placeholder="Type notes, quick markdown, brainstorms..."
            className="w-full flex-1 bg-black/20 rounded-xl p-4 border border-white/5 font-mono text-sm leading-relaxed text-white/90 outline-none resize-none focus:border-[#ffb95f]/40"
          />
        </div>
      </motion.div>
    </div>
  );
};
