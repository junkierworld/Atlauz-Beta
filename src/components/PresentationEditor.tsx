import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Presentation,
  Play,
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Star,
  Pin,
  Maximize2,
  Minimize2,
  X,
  Palette,
  Layout,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Share2,
  Download,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { ResourceItem } from '../types';
import { BadgeSelector } from './BadgeSelector';

interface PresentationEditorProps {
  presentation: ResourceItem;
  onClose: () => void;
  onUpdatePresentation: (updated: Partial<ResourceItem>) => void;
  onShowToast: (msg: string) => void;
}

export const PresentationEditor: React.FC<PresentationEditorProps> = ({
  presentation,
  onClose,
  onUpdatePresentation,
  onShowToast
}) => {
  const [isMaximized, setIsMaximized] = useState(true);
  const [slides, setSlides] = useState(
    presentation.metadata.slides || [
      {
        id: 'sl-1',
        title: 'Deep Oceanic UI: Spatial Architecture',
        body: 'Consolidating multi-tool cognitive focus through glassmorphic concealment and zero-context-switching workflows.',
        notes: 'Open by introducing the core problem: modern students lose 2.4 hours daily switching across 8 disjointed web browser tabs.',
        layout: 'title',
        bg: 'linear-gradient(135deg, #021b2b 0%, #05111d 50%, #090e1c 100%)'
      }
    ]
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(false);
  const [laserPointer, setLaserPointer] = useState(false);
  const [slideshowTime, setSlideshowTime] = useState(0);
  const [showBadgePicker, setShowBadgePicker] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(true);
  const [activeTheme, setActiveTheme] = useState('Abyssal Teal');

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const updateCurrentSlide = (field: 'title' | 'body' | 'notes' | 'layout' | 'bg', value: string) => {
    const updated = slides.map((s, idx) => (idx === currentSlideIndex ? { ...s, [field]: value } : s));
    setSlides(updated);
    onUpdatePresentation({
      metadata: { ...presentation.metadata, slides: updated }
    });
  };

  const addSlide = () => {
    const newSlide = {
      id: `sl-${Date.now()}`,
      title: 'New Slide Title',
      body: 'Click to add bullet points, architectural diagrams, or research findings.',
      notes: 'Add speaker talking points here...',
      layout: 'content',
      bg: 'linear-gradient(135deg, #060c18 0%, #0a1b2a 100%)'
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    setCurrentSlideIndex(updated.length - 1);
    onUpdatePresentation({
      metadata: { ...presentation.metadata, slides: updated, slideCount: updated.length }
    });
    onShowToast('New slide added to deck');
  };

  const duplicateSlide = () => {
    const copy = { ...currentSlide, id: `sl-${Date.now()}`, title: `${currentSlide.title} (Copy)` };
    const updated = [...slides.slice(0, currentSlideIndex + 1), copy, ...slides.slice(currentSlideIndex + 1)];
    setSlides(updated);
    setCurrentSlideIndex(currentSlideIndex + 1);
    onUpdatePresentation({
      metadata: { ...presentation.metadata, slides: updated, slideCount: updated.length }
    });
    onShowToast('Slide duplicated');
  };

  const deleteSlide = () => {
    if (slides.length <= 1) {
      onShowToast('Deck must contain at least 1 slide');
      return;
    }
    const updated = slides.filter((_, idx) => idx !== currentSlideIndex);
    setSlides(updated);
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
    onUpdatePresentation({
      metadata: { ...presentation.metadata, slides: updated, slideCount: updated.length }
    });
    onShowToast('Slide removed');
  };

  const togglePin = () => {
    const next = !presentation.isPinned;
    onUpdatePresentation({ isPinned: next });
    onShowToast(next ? '📌 Pinned presentation to Hub' : 'Unpinned presentation');
  };

  const toggleFavorite = () => {
    const next = !presentation.isFavorite;
    onUpdatePresentation({ isFavorite: next });
    onShowToast(next ? '⭐ Starred presentation' : 'Removed from Starred');
  };

  const handleSelectBadge = (badge: string) => {
    onUpdatePresentation({ badge });
    setShowBadgePicker(false);
    onShowToast(`Badge set to ${badge}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-2 bg-black/85 backdrop-blur-md overflow-hidden">
      {/* SLIDESHOW FULLSCREEN OVERLAY */}
      {isPlayingSlideshow ? (
        <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-between p-4 sm:p-8 select-none">
          {/* Slideshow Top Controls */}
          <div className="w-full flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-[#00f2fe]">
                SLIDESHOW • Slide {currentSlideIndex + 1} of {slides.length}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/60">
                <Clock className="w-3.5 h-3.5" /> 04:12 elapsed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLaserPointer(!laserPointer)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  laserPointer ? 'bg-rose-500 text-white border-rose-400' : 'bg-white/10 border-white/20'
                }`}
              >
                🔴 {laserPointer ? 'Laser Active' : 'Laser Pointer'}
              </button>
              <button
                onClick={() => setIsPlayingSlideshow(false)}
                className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs hover:bg-white/30"
              >
                Exit (Esc)
              </button>
            </div>
          </div>

          {/* Active 16:9 Presentation Canvas */}
          <div
            style={{ background: currentSlide.bg }}
            className={`w-full max-w-5xl aspect-video rounded-2xl p-8 sm:p-16 flex flex-col justify-center shadow-2xl border border-white/20 relative overflow-hidden ${
              laserPointer ? 'cursor-crosshair' : ''
            }`}
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow">
              {currentSlide.title}
            </h1>
            <p className="text-lg sm:text-2xl text-white/85 leading-relaxed max-w-3xl whitespace-pre-line font-light">
              {currentSlide.body}
            </p>
          </div>

          {/* Slideshow Bottom Navigation */}
          <div className="flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
            <button
              onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-xs font-mono">
              {currentSlideIndex + 1} / {slides.length}
            </span>
            <button
              onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : null}

      {/* REGULAR PRESENTATION EDITOR MODAL */}
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
        {/* TOP BAR: Title, Present button, Star, Pin, Badge */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded bg-white flex items-center justify-center text-black font-bold shrink-0 shadow-md">
              <Presentation className="w-5 h-5" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={presentation.title}
                  onChange={e => onUpdatePresentation({ title: e.target.value })}
                  className="text-base sm:text-lg font-bold bg-transparent border-b border-transparent hover:border-neutral-600 focus:border-white outline-none truncate max-w-xs sm:max-w-md"
                />

                <button
                  onClick={toggleFavorite}
                  className={`p-1 rounded hover:bg-neutral-800 transition-all ${
                    presentation.isFavorite ? 'text-white fill-white' : 'text-neutral-500'
                  }`}
                >
                  <Star className={`w-4 h-4 ${presentation.isFavorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={togglePin}
                  className={`p-1 rounded hover:bg-neutral-800 transition-all ${
                    presentation.isPinned ? 'text-white fill-white' : 'text-neutral-500'
                  }`}
                >
                  <Pin className={`w-4 h-4 ${presentation.isPinned ? 'fill-current' : ''}`} />
                </button>

                {/* Badge Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowBadgePicker(!showBadgePicker)}
                    className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700 flex items-center gap-1 transition-all"
                  >
                    <span>{presentation.badge || '★ Favorite'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showBadgePicker && (
                    <div className="absolute top-full left-0 mt-1 z-50">
                      <BadgeSelector
                        currentBadge={presentation.badge}
                        isPinned={presentation.isPinned}
                        isFavorite={presentation.isFavorite}
                        onSelectBadge={handleSelectBadge}
                        onTogglePin={togglePin}
                        onToggleFavorite={toggleFavorite}
                        onClose={() => setShowBadgePicker(false)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Toolbar Actions */}
              <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5 font-mono">
                <span>{slides.length} Slides</span>
                <span>•</span>
                <span>Aspect 16:9 Widescreen</span>
                <span>•</span>
                <span className="text-white">Synced</span>
              </div>
            </div>
          </div>

          {/* Right: Slideshow Present, Maximize & Close */}
          <div className="flex items-center gap-2 font-mono">
            {/* Present Slideshow Button */}
            <button
              onClick={() => setIsPlayingSlideshow(true)}
              className="px-3.5 py-1.5 rounded bg-white text-black font-bold text-xs hover:bg-neutral-200 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>PRESENT</span>
            </button>

            <button
              onClick={() => {
                setIsMaximized(!isMaximized);
                onShowToast(isMaximized ? 'Minimized Presentation View' : 'Maximized Clear Presentation Studio');
              }}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
              title={isMaximized ? 'Minimize' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-rose-500/20 text-white/60 hover:text-rose-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SLIDE EDITING TOOLBAR */}
        <div className="bg-[#0b1830] border-b border-white/10 px-4 py-1.5 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <button onClick={addSlide} className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 flex items-center gap-1 font-semibold text-[#00f2fe]">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slide</span>
          </button>

          <button onClick={duplicateSlide} className="px-2 py-1 rounded-lg hover:bg-white/10 flex items-center gap-1 text-white/70">
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>

          <button onClick={deleteSlide} className="px-2 py-1 rounded-lg hover:bg-rose-500/20 flex items-center gap-1 text-rose-400">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* Slide Background Gradient Presets */}
          <div className="flex items-center gap-1">
            <span className="text-white/50 text-[11px]">Theme:</span>
            <button
              onClick={() => updateCurrentSlide('bg', 'linear-gradient(135deg, #021b2b 0%, #05111d 50%, #090e1c 100%)')}
              className="w-5 h-5 rounded-full border border-white/30 bg-[#021b2b]"
              title="Abyssal Navy"
            />
            <button
              onClick={() => updateCurrentSlide('bg', 'linear-gradient(135deg, #072738 0%, #004d40 100%)')}
              className="w-5 h-5 rounded-full border border-white/30 bg-[#004d40]"
              title="Oceanic Emerald"
            />
            <button
              onClick={() => updateCurrentSlide('bg', 'linear-gradient(135deg, #1f1b24 0%, #331929 100%)')}
              className="w-5 h-5 rounded-full border border-white/30 bg-[#331929]"
              title="Amethyst Void"
            />
            <button
              onClick={() => updateCurrentSlide('bg', 'linear-gradient(135deg, #2b1704 0%, #090e1c 100%)')}
              className="w-5 h-5 rounded-full border border-white/30 bg-[#734320]"
              title="Solar Amber"
            />
          </div>

          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* Layout Selector */}
          <div className="flex items-center gap-1">
            <span className="text-white/50 text-[11px]">Layout:</span>
            <button
              onClick={() => updateCurrentSlide('layout', 'title')}
              className={`px-2 py-0.5 rounded text-[11px] ${currentSlide.layout === 'title' ? 'bg-[#00f2fe]/20 text-[#00f2fe]' : 'hover:bg-white/10'}`}
            >
              Title
            </button>
            <button
              onClick={() => updateCurrentSlide('layout', 'content')}
              className={`px-2 py-0.5 rounded text-[11px] ${currentSlide.layout === 'content' ? 'bg-[#00f2fe]/20 text-[#00f2fe]' : 'hover:bg-white/10'}`}
            >
              Content
            </button>
            <button
              onClick={() => updateCurrentSlide('layout', 'summary')}
              className={`px-2 py-0.5 rounded text-[11px] ${currentSlide.layout === 'summary' ? 'bg-[#00f2fe]/20 text-[#00f2fe]' : 'hover:bg-white/10'}`}
            >
              Summary
            </button>
          </div>
        </div>

        {/* WORKSPACE: Filmstrip on Left + 16:9 Central Stage + Notes Drawer */}
        <div className="flex-1 flex overflow-hidden">
          {/* FILMSTRIP OF SLIDES */}
          <div className="w-48 bg-[#09152a] border-r border-white/10 p-3 flex flex-col gap-3 overflow-y-auto shrink-0 select-none">
            <div className="flex items-center justify-between text-[11px] text-white/50 font-bold uppercase tracking-wider">
              <span>Slides ({slides.length})</span>
            </div>

            {slides.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`group cursor-pointer rounded-xl p-2 border transition-all flex flex-col gap-1 relative ${
                  idx === currentSlideIndex
                    ? 'border-[#00f2fe] bg-[#00f2fe]/10 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-white/60">
                  <span className="font-mono">#{idx + 1}</span>
                  {idx === currentSlideIndex && <span className="text-[#00f2fe] font-bold">Active</span>}
                </div>
                {/* Micro Thumbnail Canvas */}
                <div
                  style={{ background: s.bg }}
                  className="w-full aspect-video rounded-md p-1.5 flex flex-col justify-center overflow-hidden border border-white/10"
                >
                  <span className="text-[9px] font-bold text-white truncate">{s.title}</span>
                  <span className="text-[7px] text-white/60 line-clamp-2">{s.body}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CENTRAL 16:9 CANVAS */}
          <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-8 items-center justify-center bg-[#070f1e] relative">
            <div
              style={{ background: currentSlide.bg }}
              className="w-full max-w-4xl aspect-video rounded-2xl p-6 sm:p-12 shadow-[0_16px_50px_rgba(0,0,0,0.8)] border border-white/20 flex flex-col justify-center relative overflow-hidden transition-all duration-300"
            >
              {/* Editable Slide Title */}
              <input
                type="text"
                value={currentSlide.title}
                onChange={e => updateCurrentSlide('title', e.target.value)}
                placeholder="Enter slide title..."
                className="text-2xl sm:text-4xl font-extrabold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#00f2fe] outline-none pb-2 mb-4 drop-shadow-md"
              />

              {/* Editable Slide Content Body */}
              <textarea
                value={currentSlide.body}
                onChange={e => updateCurrentSlide('body', e.target.value)}
                placeholder="Click to enter slide content, bullet points, or takeaways..."
                className="w-full flex-1 text-sm sm:text-lg text-white/85 bg-transparent border border-transparent hover:border-white/10 focus:border-[#00f2fe] rounded-lg p-2 outline-none resize-none leading-relaxed font-light"
              />
            </div>

            {/* Bottom Speaker Notes Drawer */}
            {showNotesDrawer && (
              <div className="w-full max-w-4xl mt-4 bg-[#0a1529] border border-white/10 rounded-xl p-3 shadow-lg">
                <div className="flex items-center justify-between text-xs text-white/60 mb-1.5">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#aceef3]">
                    Speaker Notes (Slide {currentSlideIndex + 1})
                  </span>
                  <button onClick={() => setShowNotesDrawer(false)} className="text-white/40 hover:text-white">✕</button>
                </div>
                <textarea
                  value={currentSlide.notes}
                  onChange={e => updateCurrentSlide('notes', e.target.value)}
                  placeholder="Type speaking prompts, cadence guides, or committee questions..."
                  className="w-full text-xs text-white/80 bg-white/5 border border-white/10 rounded-lg p-2 outline-none h-14 resize-none"
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
