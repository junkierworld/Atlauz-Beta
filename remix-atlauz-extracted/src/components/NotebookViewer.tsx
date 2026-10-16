import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Plus,
  Bookmark,
  Star,
  Pin,
  Maximize2,
  Minimize2,
  X,
  FileText,
  ChevronDown
} from 'lucide-react';
import { ResourceItem } from '../types';
import { BadgeSelector } from './BadgeSelector';

interface NotebookViewerProps {
  notebook: ResourceItem;
  onClose: () => void;
  onUpdateNotebook: (updated: Partial<ResourceItem>) => void;
  onShowToast: (msg: string) => void;
}

export const NotebookViewer: React.FC<NotebookViewerProps> = ({
  notebook,
  onClose,
  onUpdateNotebook,
  onShowToast
}) => {
  const [isMaximized, setIsMaximized] = useState(true);
  const [pages, setPages] = useState(
    notebook.metadata.pages || [
      { id: 'p-1', title: 'Page 1: Field Notes', content: 'Type laboratory or lecture notes...', badge: '⭐ Favorite', isBookmarked: true }
    ]
  );
  const [activePageIndex, setActivePageIndex] = useState(notebook.metadata.activePageIndex || 0);
  const [showBadgePicker, setShowBadgePicker] = useState(false);

  const activePage = pages[activePageIndex] || pages[0];

  const updatePage = (field: 'title' | 'content' | 'badge' | 'isBookmarked', value: any) => {
    const updated = pages.map((p, idx) => (idx === activePageIndex ? { ...p, [field]: value } : p));
    setPages(updated);
    onUpdateNotebook({
      metadata: { ...notebook.metadata, pages: updated, activePageIndex }
    });
  };

  const addPage = () => {
    const newPage = {
      id: `p-${Date.now()}`,
      title: `Page ${pages.length + 1}: Unnamed Notes`,
      content: 'Start typing thoughts, definitions, or synthesis...',
      badge: '💡 Eureka',
      isBookmarked: false
    };
    const updated = [...pages, newPage];
    setPages(updated);
    setActivePageIndex(updated.length - 1);
    onUpdateNotebook({
      metadata: { ...notebook.metadata, pages: updated, activePageIndex: updated.length - 1 }
    });
    onShowToast('New page added to notebook');
  };

  const togglePin = () => {
    const next = !notebook.isPinned;
    onUpdateNotebook({ isPinned: next });
    onShowToast(next ? '📌 Pinned notebook to Hub' : 'Unpinned notebook');
  };

  const toggleFavorite = () => {
    const next = !notebook.isFavorite;
    onUpdateNotebook({ isFavorite: next });
    onShowToast(next ? '⭐ Starred notebook' : 'Removed from Starred');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-2 bg-black/80 backdrop-blur-md overflow-hidden">
      <motion.div
        layout
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className={`bg-neutral-950 text-white flex flex-col shadow-2xl overflow-hidden transition-all duration-300 font-sans ${
          isMaximized
            ? 'w-full h-full rounded-none sm:rounded-lg border border-neutral-700'
            : 'w-full max-w-5xl h-[88vh] rounded-lg border border-neutral-700'
        }`}
      >
        {/* Header Bar */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-white text-black flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={notebook.title}
                  onChange={e => onUpdateNotebook({ title: e.target.value })}
                  className="font-bold text-base sm:text-lg bg-transparent border-b border-transparent hover:border-neutral-600 focus:border-white outline-none"
                />
                <button onClick={toggleFavorite} className="text-white">
                  <Star className={`w-4 h-4 ${notebook.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button onClick={togglePin} className="text-white">
                  <Pin className={`w-4 h-4 ${notebook.isPinned ? 'fill-current' : ''}`} />
                </button>

                {/* Badge button */}
                <div className="relative font-mono">
                  <button
                    onClick={() => setShowBadgePicker(!showBadgePicker)}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700 flex items-center gap-1"
                  >
                    <span>{notebook.badge || '★ Favorite'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showBadgePicker && (
                    <div className="absolute top-full left-0 mt-1 z-50">
                      <BadgeSelector
                        currentBadge={notebook.badge}
                        isPinned={notebook.isPinned}
                        isFavorite={notebook.isFavorite}
                        onSelectBadge={b => {
                          onUpdateNotebook({ badge: b });
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
              <span className="text-xs text-white/50">{pages.length} Pages • Spiral Bound Digital Binder</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Notebook Body: Page Tabs on Left + Ruled Paper Canvas on Right */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Page Tabs */}
          <div className="w-56 bg-[#09152a] border-r border-white/10 p-3 flex flex-col gap-2 overflow-y-auto shrink-0">
            <div className="flex items-center justify-between text-xs text-white/50 font-bold uppercase mb-1">
              <span>Pages ({pages.length})</span>
              <button
                onClick={addPage}
                className="px-2 py-0.5 rounded bg-[#00f2fe]/20 text-[#00f2fe] font-bold text-xs flex items-center gap-1 hover:bg-[#00f2fe]/30"
              >
                <Plus className="w-3.5 h-3.5" /> New Page
              </button>
            </div>

            {pages.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActivePageIndex(idx)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col gap-1 ${
                  idx === activePageIndex
                    ? 'border-[#00f2fe] bg-[#00f2fe]/10 text-white shadow-sm'
                    : 'border-white/5 bg-white/[0.02] text-white/70 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold truncate">{p.title}</span>
                  {p.isBookmarked && <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/50">
                  <span className="px-1.5 py-0.2 rounded bg-white/10">{p.badge || 'Notes'}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Center Ruled Paper Canvas */}
          <div className="flex-1 flex flex-col bg-[#060e1d] p-4 sm:p-8 overflow-y-auto items-center justify-start">
            <div className="w-full max-w-3xl bg-[#09152a] rounded-2xl border border-white/10 p-6 sm:p-10 shadow-2xl flex flex-col min-h-[600px] relative">
              {/* Ribbon Bookmark top right */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <input
                  type="text"
                  value={activePage.title}
                  onChange={e => updatePage('title', e.target.value)}
                  className="text-xl font-bold bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#00f2fe] outline-none text-white w-2/3"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updatePage('isBookmarked', !activePage.isBookmarked)}
                    className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                      activePage.isBookmarked
                        ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                    <span>{activePage.isBookmarked ? 'Bookmarked' : 'Bookmark Page'}</span>
                  </button>
                </div>
              </div>

              {/* Editable Page Body */}
              <textarea
                value={activePage.content}
                onChange={e => updatePage('content', e.target.value)}
                placeholder="Start writing notes..."
                className="w-full flex-1 bg-transparent text-white/90 text-sm sm:text-base leading-relaxed outline-none resize-none"
              />

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 mt-4">
                <span>Characters: {activePage.content.length}</span>
                <span className="text-[#00f2fe]">Autosaved to Atlauz Local Vault</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
