import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Book,
  ChevronLeft,
  ChevronRight,
  Star,
  Pin,
  Maximize2,
  Minimize2,
  X,
  Type,
  Sun,
  Moon,
  Bookmark,
  ChevronDown
} from 'lucide-react';
import { ResourceItem } from '../types';
import { BadgeSelector } from './BadgeSelector';

interface EbookReaderProps {
  ebook: ResourceItem;
  onClose: () => void;
  onUpdateEbook: (updated: Partial<ResourceItem>) => void;
  onShowToast: (msg: string) => void;
}

export const EbookReader: React.FC<EbookReaderProps> = ({
  ebook,
  onClose,
  onUpdateEbook,
  onShowToast
}) => {
  const [isMaximized, setIsMaximized] = useState(true);
  const [fontSize, setFontSize] = useState(ebook.metadata.fontSize || 17);
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'light'>(ebook.metadata.ebookTheme || 'dark');
  const [activeChapterIndex, setActiveChapterIndex] = useState(ebook.metadata.activeChapterIndex || 0);
  const [showBadgePicker, setShowBadgePicker] = useState(false);
  const [loadedChapters, setLoadedChapters] = useState<Set<number>>(new Set([0]));
  const [isLoadingChapter, setIsLoadingChapter] = useState(false);

  const chapters = ebook.metadata.chapters || [
    { id: 'ch-1', title: 'Chapter 1: The Affordances of Invisible Interfaces', readingTime: '12 min', content: 'Sample chapter content...' }
  ];
  const activeChapter = chapters[activeChapterIndex] || chapters[0];

  // Progressive chapter loading: preload adjacent chapters
  React.useEffect(() => {
    setIsLoadingChapter(true);
    const chaptersToLoad = [activeChapterIndex];
    if (activeChapterIndex > 0) chaptersToLoad.push(activeChapterIndex - 1);
    if (activeChapterIndex < chapters.length - 1) chaptersToLoad.push(activeChapterIndex + 1);

    setTimeout(() => {
      setLoadedChapters(prev => new Set([...prev, ...chaptersToLoad]));
      setIsLoadingChapter(false);
    }, 100);
  }, [activeChapterIndex, chapters.length]);

  const togglePin = () => {
    const next = !ebook.isPinned;
    onUpdateEbook({ isPinned: next });
    onShowToast(next ? '📌 Pinned ebook to Hub' : 'Unpinned ebook');
  };

  const toggleFavorite = () => {
    const next = !ebook.isFavorite;
    onUpdateEbook({ isFavorite: next });
    onShowToast(next ? '⭐ Starred ebook' : 'Removed from Starred');
  };

  const themeStyles = {
    dark: 'bg-[#0a1529] text-[#e1e3e3] border-white/10',
    sepia: 'bg-[#f4ecd8] text-[#433422] border-[#d8ccb4]',
    light: 'bg-[#ffffff] text-[#1f2937] border-gray-200'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-2 bg-black/80 backdrop-blur-md overflow-hidden">
      <motion.div
        layout
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className={`flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${themeStyles[theme]} ${
          isMaximized
            ? 'w-full h-full rounded-none sm:rounded-xl border'
            : 'w-full max-w-4xl h-[88vh] rounded-2xl border'
        }`}
      >
        {/* Top Control Bar */}
        <div className="px-4 py-2.5 border-b border-inherit flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#bdc2ff]/20 text-[#bdc2ff] flex items-center justify-center font-bold">
              <Book className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base truncate max-w-xs">{ebook.title}</span>
                <button onClick={toggleFavorite} className="text-amber-400">
                  <Star className={`w-4 h-4 ${ebook.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button onClick={togglePin} className="text-[#00f2fe]">
                  <Pin className={`w-4 h-4 ${ebook.isPinned ? 'fill-current' : ''}`} />
                </button>

                {/* Badge button */}
                <div className="relative">
                  <button
                    onClick={() => setShowBadgePicker(!showBadgePicker)}
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#bdc2ff]/15 text-[#bdc2ff] border border-[#bdc2ff]/30 flex items-center gap-1"
                  >
                    <span>{ebook.badge || '💡 Eureka'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showBadgePicker && (
                    <div className="absolute top-full left-0 mt-1 z-50">
                      <BadgeSelector
                        currentBadge={ebook.badge}
                        isPinned={ebook.isPinned}
                        isFavorite={ebook.isFavorite}
                        onSelectBadge={b => {
                          onUpdateEbook({ badge: b });
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
              <span className="text-xs opacity-60">By {ebook.metadata.author || 'Author'}</span>
            </div>
          </div>

          {/* Reader Preferences & Window Controls */}
          <div className="flex items-center gap-2">
            {/* Font size adjustments */}
            <div className="flex items-center gap-1 bg-black/10 dark:bg-white/10 px-2 py-1 rounded-lg text-xs">
              <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="font-bold px-1">A-</button>
              <span className="font-mono text-[11px]">{fontSize}px</span>
              <button onClick={() => setFontSize(Math.min(28, fontSize + 2))} className="font-bold px-1">A+</button>
            </div>

            {/* Theme switcher: dark, sepia, light */}
            <div className="flex items-center gap-1 bg-black/10 dark:bg-white/10 p-1 rounded-lg text-xs">
              <button
                onClick={() => setTheme('dark')}
                className={`px-2 py-0.5 rounded ${theme === 'dark' ? 'bg-[#00f2fe]/20 text-[#00f2fe] font-bold' : ''}`}
              >
                Dark
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`px-2 py-0.5 rounded ${theme === 'sepia' ? 'bg-[#d8ccb4] text-[#433422] font-bold' : ''}`}
              >
                Sepia
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`px-2 py-0.5 rounded ${theme === 'light' ? 'bg-white text-gray-900 font-bold' : ''}`}
              >
                Light
              </button>
            </div>

            <button
              onClick={() => {
                setIsMaximized(!isMaximized);
                onShowToast(isMaximized ? 'Minimized' : 'Maximized Clean Clarity View');
              }}
              className="p-2 rounded-lg hover:bg-black/10 opacity-70 hover:opacity-100"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-rose-500/20 opacity-70 hover:opacity-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ebook Main Reading Pane */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chapter Table of Contents */}
          <div className="w-60 border-r border-inherit p-3 flex flex-col gap-2 overflow-y-auto shrink-0 text-xs">
            <span className="font-bold uppercase opacity-60 text-[10px]">Table of Contents</span>
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => setActiveChapterIndex(idx)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                  idx === activeChapterIndex
                    ? 'border-[#00f2fe] bg-[#00f2fe]/15 font-bold shadow-sm'
                    : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                }`}
              >
                <div className="truncate font-semibold">{ch.title}</div>
                <div className="text-[10px] opacity-60 mt-0.5">{ch.readingTime}</div>
              </button>
            ))}
          </div>

          {/* Reading Column */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex justify-center">
            <div className="max-w-2xl w-full">
              <div className="pb-4 border-b border-inherit mb-6">
                <span className="text-xs uppercase font-mono tracking-wider text-[#00f2fe] block mb-1">
                  Chapter {activeChapterIndex + 1} of {chapters.length}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {activeChapter.title}
                </h1>
              </div>

              <div
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }}
                className="leading-relaxed font-serif select-text"
              >
                <p className="mb-6">{activeChapter.content}</p>
                <p className="mb-6 opacity-90">
                  "Cognitive offloading occurs when physical action alters the computational requirements of a task to reduce mental effort." By offloading context management into persistent visual states, working memory remains unburdened.
                </p>
              </div>

              {/* Navigation Between Chapters */}
              <div className="mt-12 pt-6 border-t border-inherit flex items-center justify-between">
                <button
                  onClick={() => setActiveChapterIndex(Math.max(0, activeChapterIndex - 1))}
                  disabled={activeChapterIndex === 0}
                  className="px-4 py-2 rounded-xl border border-inherit disabled:opacity-30 flex items-center gap-1.5 text-xs font-semibold"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Chapter
                </button>
                <button
                  onClick={() => setActiveChapterIndex(Math.min(chapters.length - 1, activeChapterIndex + 1))}
                  disabled={activeChapterIndex === chapters.length - 1}
                  className="px-4 py-2 rounded-xl border border-inherit disabled:opacity-30 flex items-center gap-1.5 text-xs font-semibold"
                >
                  Next Chapter <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
