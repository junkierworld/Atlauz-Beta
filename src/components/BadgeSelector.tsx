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
  isDark?: boolean;
}

export const BadgeSelector: React.FC<BadgeSelectorProps> = ({
  currentBadge,
  isPinned,
  isFavorite,
  onSelectBadge,
  onTogglePin,
  onToggleFavorite,
  onClose,
  isDark = true
}) => {
  return (
    <div
      onClick={e => e.stopPropagation()}
      className={`p-3 rounded-lg shadow-2xl w-64 max-w-[calc(100vw-32px)] z-50 text-xs animate-in fade-in zoom-in-95 duration-150 border ${
        isDark
          ? 'bg-neutral-900 border-neutral-700 text-white'
          : 'bg-neutral-50 border-neutral-300 text-neutral-900'
      }`}
    >
      <div className={`flex items-center justify-between pb-2 border-b mb-2 ${
        isDark ? 'border-neutral-800' : 'border-neutral-200'
      }`}>
        <span className={`font-bold text-neutral-300 tracking-wide uppercase text-[10px] font-mono ${
          isDark ? 'text-neutral-300' : 'text-neutral-700'
        }`}>
          [STATUS & BADGES]
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className={`text-xs px-1 font-mono ${
              isDark
                ? 'text-neutral-500 hover:text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
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
                ? isDark
                  ? 'bg-white text-black border-white'
                  : 'bg-neutral-900 text-white border-neutral-900'
                : isDark
                ? 'bg-neutral-850 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                : 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:bg-neutral-200'
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
                ? isDark
                  ? 'bg-white text-black border-white'
                  : 'bg-neutral-900 text-white border-neutral-900'
                : isDark
                ? 'bg-neutral-850 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                : 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Pin className="w-3.5 h-3.5 fill-current" />
            <span>{isPinned ? 'Pinned' : 'Pin to Hub'}</span>
          </button>
        )}
      </div>

      {/* Badge List */}
      <div className={`space-y-1 max-h-48 overflow-y-auto pr-1 ${
        isDark ? 'text-neutral-400' : 'text-neutral-600'
      }`}>
        <div className={`text-[10px] mb-1 font-mono uppercase ${
          isDark ? 'text-neutral-400' : 'text-neutral-600'
        }`}>Select Badge:</div>
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
                  ? isDark
                    ? 'bg-neutral-800 border-neutral-400 text-white font-bold ring-1 ring-white/20'
                    : 'bg-neutral-200 border-neutral-600 text-neutral-900 font-bold ring-1 ring-neutral-600/20'
                  : isDark
                  ? 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
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
