import React from 'react';
import { AVAILABLE_BADGES } from '../data';
import { Star, Pin } from 'lucide-react';

interface BadgeSelectorProps {
  currentBadge?: string;
  isPinned?: boolean;
  isFavorite?: boolean;
  onSelectBadge: (badge: string) => void;
  onTogglePin?: () => void;
  onToggleFavorite?: () => void;
  onClose?: () => void;
}

export const BadgeSelector: React.FC<BadgeSelectorProps> = ({
  currentBadge,
  isPinned,
  isFavorite,
  onSelectBadge,
  onTogglePin,
  onToggleFavorite,
  onClose
}) => {
  return (
    <div
      onClick={e => e.stopPropagation()}
      className="p-3 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl text-white w-64 max-w-[calc(100vw-32px)] z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-2">
        <span className="font-bold text-neutral-300 tracking-wide uppercase text-[10px] font-mono">
          [STATUS & BADGES]
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white text-xs px-1 font-mono"
          >
            [X]
          </button>
        )}
      </div>

      {/* Quick Action Toggles */}
      <div className="grid grid-cols-2 gap-1.5 mb-2.5">
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded border text-[11px] font-semibold transition-all ${
              isFavorite
                ? 'bg-white text-black border-white'
                : 'bg-neutral-850 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{isFavorite ? 'Bookmarked' : 'Bookmark'}</span>
          </button>
        )}

        {onTogglePin && (
          <button
            onClick={onTogglePin}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded border text-[11px] font-semibold transition-all ${
              isPinned
                ? 'bg-white text-black border-white'
                : 'bg-neutral-850 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Pin className="w-3.5 h-3.5 fill-current" />
            <span>{isPinned ? 'Pinned' : 'Pin to Hub'}</span>
          </button>
        )}
      </div>

      {/* Badge List */}
      <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
        <div className="text-[10px] text-neutral-400 mb-1 font-mono uppercase">Select Badge:</div>
        {AVAILABLE_BADGES.map(b => {
          const isSelected = currentBadge === b.label;
          return (
            <button
              key={b.id}
              onClick={() => {
                onSelectBadge(b.label);
                if (onClose) onClose();
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded border flex items-center justify-between text-[11px] font-medium transition-all ${
                isSelected
                  ? 'bg-neutral-800 border-neutral-400 text-white font-bold ring-1 ring-white/20'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <span>{b.label}</span>
              {isSelected && <span className="text-[10px] font-mono">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
