import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Presentation,
  FileText,
  Plus,
  Trash2,
  Copy,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Layout,
  Code,
  Check,
  GripVertical,
  Type,
  Square,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { StudioDeckSlide, StudioDocument } from '../types';

interface DocumentDeckStudioProps {
  onClose?: () => void;
  onShowToast: (msg: string) => void;
  initialFormat?: 'deck' | 'document';
}

const DEFAULT_SLIDES: StudioDeckSlide[] = [
  {
    id: 'slide-1',
    title: 'Hadal Acoustic Telemetry & Waveform Synthesis',
    layout: 'headline_metric',
    body: 'Investigation into 20Hz-200kHz hydrophone signal compression and tactile sonar rendering without acoustic latency.',
    notes: 'Speaker notes: Emphasize sub-1ms LRA haptic actuation at 240Hz sinusoidal phase vocoder.',
    metricValue: '98.4%',
    metricLabel: 'Tactile Clarity Verification',
    blocks: [
      { id: 'b-1', type: 'heading', text: 'Challenger Deep Hydrophone Array' },
      { id: 'b-2', type: 'paragraph', text: 'Salinity attenuation compensation alpha = 0.048 dB/km at oceanic isotherms.' }
    ]
  },
  {
    id: 'slide-2',
    title: 'Structural Architecture & Sensory Feedback Loops',
    layout: 'split_wireframe',
    body: 'Multimodal interaction design: Left container models tactile waveform packets; right container maps acoustic carriers.',
    notes: 'Highlight zero-pill discipline and monochrome grayscale prototype philosophy.',
    blocks: [
      { id: 'b-3', type: 'grid_box', text: 'Carrier Frequency: 240 Hz sinusoidal waveform' },
      { id: 'b-4', type: 'grid_box', text: 'Impulse Latency: 0.82 ms measured at glass transducer' },
      { id: 'b-5', type: 'code_snippet', text: 'navigator.vibrate?.([240, 20, 192]);' }
    ]
  },
  {
    id: 'slide-3',
    title: 'Symposium Milestones & Experimental Deliverables',
    layout: 'bullet_grid',
    body: 'Deliverables verified for peer review symposium with Dr. Sarah Lin and faculty board.',
    notes: 'Review equations in section 3.4 with Elena and Marcus.',
    blocks: [
      { id: 'b-6', type: 'paragraph', text: '1. ArXiv preprint reference graph linked via CRDT sync.' },
      { id: 'b-7', type: 'paragraph', text: '2. Wasm audio synthesizer compiled and verified in Rust.' },
      { id: 'b-8', type: 'paragraph', text: '3. Multi-author collaborative note reconciliation passed.' }
    ]
  }
];

export const DocumentDeckStudio: React.FC<DocumentDeckStudioProps> = ({
  onClose,
  onShowToast,
  initialFormat = 'deck'
}) => {
  const [studioFormat, setStudioFormat] = useState<'deck' | 'document'>(initialFormat);
  const [slides, setSlides] = useState<StudioDeckSlide[]>(DEFAULT_SLIDES);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [docContent, setDocContent] = useState<string>(
    `# Hadal Oceanic UI Acoustics & Haptic Sonar Thesis Draft\n\n## Section 3.4: Bathypelagic Audio-Haptic Feedback Architecture\n\nHydrophone frequency profiles (20Hz - 200kHz) recorded across the Mariana Hadal Zone are compressed directly into tactile waveform packets, enabling tactile sonar feedback for oceanographic researchers on glass touchscreens without high acoustic latency.\n\n### Mathematical Formulation\nAttenuation coefficient alpha = 0.048 dB/km at oceanic isotherms below 4°C.\n\n### Collaborative Notes\n- Verified with Dr. Sarah Lin\n- Local-first CRDT block reconciliation committed.`
  );

  // Drag and drop state for slide ordering
  const [draggedSlideIdx, setDraggedSlideIdx] = useState<number | null>(null);

  const activeSlide = slides[activeSlideIndex] || slides[0];

  const handleUpdateSlide = (updated: Partial<StudioDeckSlide>) => {
    setSlides(prev =>
      prev.map((s, idx) => (idx === activeSlideIndex ? { ...s, ...updated } : s))
    );
  };

  const handleAddSlide = () => {
    const newSlide: StudioDeckSlide = {
      id: `slide-${Date.now()}`,
      title: `New Section ${slides.length + 1}: Monochromatic Spec`,
      layout: 'split_wireframe',
      body: 'Add synthesis prose, wireframe containers, or code snippets here.',
      notes: 'Speaker notes for this section.',
      blocks: [
        { id: `b-${Date.now()}`, type: 'paragraph', text: 'Structural wireframe block ready for documentation.' }
      ]
    };
    setSlides(prev => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
    onShowToast(`Slide ${slides.length + 1} added to deck`);
  };

  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) {
      onShowToast('At least 1 slide is required');
      return;
    }
    const filtered = slides.filter((_, i) => i !== idx);
    setSlides(filtered);
    setActiveSlideIndex(Math.max(0, idx - 1));
    onShowToast('Slide removed');
  };

  // Export Pipeline: Client-side vector rendering & formats
  const handleExport = (format: 'pdf' | 'svg' | 'png' | 'md' | 'json') => {
    if (format === 'md') {
      const blob = new Blob([docContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `atlauz_studio_document_${Date.now()}.md`;
      a.click();
      URL.revokeObjectURL(url);
      onShowToast('Markdown document exported');
      return;
    }

    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(slides, null, 2));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = `atlauz_studio_deck_${Date.now()}.json`;
      a.click();
      onShowToast('Slide Deck JSON schema exported');
      return;
    }

    if (format === 'svg') {
      // Generate clean vector SVG of current slide
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
          <rect width="1920" height="1080" fill="#0a0a0a" />
          <rect x="40" y="40" width="1840" height="1000" fill="none" stroke="#262626" stroke-width="2" />
          <text x="120" y="180" font-family="Helvetica, Arial, sans-serif" font-size="54" font-weight="bold" fill="#ffffff">${activeSlide.title}</text>
          <text x="120" y="260" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#a3a3a3">${activeSlide.body}</text>
          ${activeSlide.metricValue ? `<text x="120" y="480" font-family="Helvetica, Arial, sans-serif" font-size="120" font-weight="bold" fill="#ffffff">${activeSlide.metricValue}</text><text x="120" y="540" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#737373">${activeSlide.metricLabel || ''}</text>` : ''}
          <text x="120" y="980" font-family="monospace" font-size="20" fill="#525252">ATLAUZ CANVAS STUDIO • VECTOR EXPORT</text>
        </svg>
      `;
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `slide_${activeSlideIndex + 1}_vector.svg`;
      a.click();
      URL.revokeObjectURL(url);
      onShowToast('Vector SVG exported for high print legibility');
      return;
    }

    if (format === 'pdf' || format === 'png') {
      window.print();
      onShowToast('Print & PDF export dialog invoked');
    }
  };

  return (
    <div className="w-full space-y-4 font-sans select-none animate-fade-in">
      {/* Studio Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-neutral-900 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-neutral-800 border border-neutral-700 text-white shrink-0">
            {studioFormat === 'deck' ? <Presentation className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight font-mono">
                Integrated Canvas Deck & Document Studio
              </h2>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold uppercase">
                MONOCHROME ENGINE
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Client-side vector rendering, structural layout grids & clean export pipeline.
            </p>
          </div>
        </div>

        {/* Toolbar Switcher & Export Dropdown */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center bg-neutral-950 p-0.5 rounded border border-neutral-800">
            <button
              onClick={() => setStudioFormat('deck')}
              className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1 ${
                studioFormat === 'deck' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Presentation className="w-3 h-3" />
              <span>16:9 Deck ({slides.length})</span>
            </button>
            <button
              onClick={() => setStudioFormat('document')}
              className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1 ${
                studioFormat === 'document' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>Document</span>
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleExport('svg')}
              className="px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs flex items-center gap-1"
              title="Export clean vector SVG"
            >
              <Download className="w-3 h-3" />
              <span>SVG</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs flex items-center gap-1"
              title="Print or export to PDF"
            >
              <Printer className="w-3 h-3" />
              <span>PDF</span>
            </button>
            {studioFormat === 'document' && (
              <button
                onClick={() => handleExport('md')}
                className="px-2.5 py-1 rounded bg-white text-black font-bold text-xs flex items-center gap-1"
              >
                <span>Export MD</span>
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      {/* STUDIO BODY: DECK MODE */}
      {studioFormat === 'deck' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT: SLIDES STRIP (Drag & drop list) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-neutral-800 font-mono text-xs">
              <span className="text-neutral-400 font-bold uppercase">Slides ({slides.length})</span>
              <button
                onClick={handleAddSlide}
                className="text-xs text-white hover:underline flex items-center gap-1 font-bold"
              >
                <Plus className="w-3 h-3" />
                <span>Add Slide</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[540px] overflow-y-auto no-scrollbar font-mono text-xs">
              {slides.map((s, idx) => {
                const isActive = idx === activeSlideIndex;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveSlideIndex(idx)}
                    draggable
                    onDragStart={() => setDraggedSlideIdx(idx)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => {
                      if (draggedSlideIdx === null || draggedSlideIdx === idx) return;
                      const updated = [...slides];
                      const [removed] = updated.splice(draggedSlideIdx, 1);
                      updated.splice(idx, 0, removed);
                      setSlides(updated);
                      setActiveSlideIndex(idx);
                      setDraggedSlideIdx(null);
                      onShowToast('Slide reordered');
                    }}
                    className={`p-2.5 rounded border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isActive
                        ? 'bg-neutral-800 border-white ring-1 ring-white/50 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <GripVertical className="w-3 h-3 text-neutral-600 shrink-0 cursor-grab" />
                      <span className="font-bold w-4 text-[10px] shrink-0">{idx + 1}.</span>
                      <span className="text-xs truncate">{s.title}</span>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteSlide(idx);
                      }}
                      className="p-1 text-neutral-600 hover:text-red-400 transition-colors"
                      title="Delete slide"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: ACTIVE 16:9 SLIDE CANVAS STAGE */}
          <div className="lg:col-span-9 space-y-4">
            {/* 16:9 Canvas Stage with stark structural grid lines */}
            <div className="w-full aspect-[16/9] rounded-lg bg-neutral-950 border-2 border-neutral-700 p-6 sm:p-10 flex flex-col justify-between relative shadow-2xl overflow-hidden font-sans">
              {/* Subtle structural wireframe guide border */}
              <div className="absolute inset-4 border border-dashed border-neutral-800 pointer-events-none" />

              {/* Slide Header & Editable Title */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span className="uppercase font-bold tracking-widest text-neutral-400">
                    [SLIDE {activeSlideIndex + 1} OF {slides.length}] • {activeSlide.layout.replace('_', ' ').toUpperCase()}
                  </span>
                  <span>ATLAUZ MONOCHROME STUDIO</span>
                </div>

                <input
                  type="text"
                  value={activeSlide.title}
                  onChange={e => handleUpdateSlide({ title: e.target.value })}
                  className="w-full bg-transparent text-xl sm:text-2xl lg:text-3xl font-bold text-white outline-none focus:border-b focus:border-white font-sans tracking-tight"
                  placeholder="Slide Headline Title..."
                />

                <textarea
                  value={activeSlide.body}
                  onChange={e => handleUpdateSlide({ body: e.target.value })}
                  rows={2}
                  className="w-full bg-transparent text-xs sm:text-sm text-neutral-400 outline-none resize-none leading-relaxed"
                  placeholder="Slide subtitle or synthesis statement..."
                />
              </div>

              {/* Slide Body Content by Layout */}
              <div className="relative z-10 my-auto py-4">
                {activeSlide.layout === 'headline_metric' && (
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-4">
                      <input
                        type="text"
                        value={activeSlide.metricValue || '98.4%'}
                        onChange={e => handleUpdateSlide({ metricValue: e.target.value })}
                        className="bg-transparent font-mono text-4xl sm:text-6xl font-bold text-white outline-none w-64"
                      />
                      <input
                        type="text"
                        value={activeSlide.metricLabel || 'Verification Score'}
                        onChange={e => handleUpdateSlide({ metricLabel: e.target.value })}
                        className="bg-transparent font-mono text-xs sm:text-sm text-neutral-400 outline-none w-60"
                      />
                    </div>
                  </div>
                )}

                {activeSlide.layout === 'split_wireframe' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded border border-neutral-800 bg-neutral-900/60 font-mono text-xs text-neutral-300">
                      <span className="text-[10px] text-neutral-500 uppercase block mb-1">[CONTAINER A]</span>
                      Acoustic carrier wave mapped at 240 Hz sinusoidal waveform.
                    </div>
                    <div className="p-4 rounded border border-neutral-800 bg-neutral-900/60 font-mono text-xs text-neutral-300">
                      <span className="text-[10px] text-neutral-500 uppercase block mb-1">[CONTAINER B]</span>
                      Sub-1ms LRA haptic actuation at glass transducer.
                    </div>
                  </div>
                )}

                {activeSlide.layout === 'bullet_grid' && (
                  <div className="space-y-2">
                    {activeSlide.blocks.map(b => (
                      <div key={b.id} className="flex items-center gap-2 p-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
                        <Square className="w-3 h-3 text-neutral-500 shrink-0" />
                        <span>{b.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Slide Footer */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-neutral-800">
                <span>Page {activeSlideIndex + 1}</span>
                <div className="flex items-center gap-2">
                  <select
                    value={activeSlide.layout}
                    onChange={e => handleUpdateSlide({ layout: e.target.value as any })}
                    className="bg-neutral-900 border border-neutral-700 text-white rounded px-2 py-0.5 text-[10px] outline-none font-mono"
                  >
                    <option value="headline_metric">Headline + Metric</option>
                    <option value="split_wireframe">Split Wireframe</option>
                    <option value="bullet_grid">Bullet Grid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Speaker Notes Area */}
            <div className="p-3 rounded bg-neutral-900 border border-neutral-800 font-mono text-xs">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">
                Speaker Telemetry & Presentation Notes:
              </span>
              <textarea
                value={activeSlide.notes}
                onChange={e => handleUpdateSlide({ notes: e.target.value })}
                rows={2}
                className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-neutral-300 outline-none resize-none"
                placeholder="Speaker cues and symposium pacing reminders..."
              />
            </div>
          </div>
        </div>
      )}

      {/* STUDIO BODY: DOCUMENT MODE */}
      {studioFormat === 'document' && (
        <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 font-mono text-xs">
            <span className="text-white font-bold uppercase">
              Monochrome Document Canvas
            </span>
            <div className="flex items-center gap-2 text-neutral-400">
              <span>{docContent.split(/\s+/).filter(Boolean).length} Words</span>
              <span>•</span>
              <span>{docContent.length} Characters</span>
            </div>
          </div>

          <textarea
            value={docContent}
            onChange={e => setDocContent(e.target.value)}
            rows={16}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-4 font-mono text-xs text-white leading-relaxed outline-none focus:border-white resize-y"
            placeholder="Type structured thesis markdown..."
          />
        </div>
      )}
    </div>
  );
};
