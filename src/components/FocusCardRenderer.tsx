import React, { useState, useEffect } from 'react';
import {
  FileText,
  Presentation,
  GraduationCap,
  Edit3,
  ListTodo,
  BookOpen,
  Minimize2,
  ChevronDown,
  Play,
  Pause,
  CheckCircle,
  Copy,
  Plus,
  Check,
  Trash2,
  Settings2,
  ExternalLink
} from 'lucide-react';
import { FocusCardItem, FocusCardPurpose } from '../types';

interface FocusCardRendererProps {
  card: FocusCardItem;
  isDominant: boolean;
  isMobileLandscape?: boolean;
  showIconOnly?: boolean;
  onUpdateCard: (id: string, updated: Partial<FocusCardItem>) => void;
  onRemoveCard?: (id: string) => void;
  onChangePurpose: (id: string, newPurpose: FocusCardPurpose) => void;
  onLaunchFullResource?: (resourceType: string) => void;
  onMinimizeCard?: () => void;
  onShowToast: (msg: string) => void;
  canRemove?: boolean;
}

export const FocusCardRenderer: React.FC<FocusCardRendererProps> = ({
  card,
  isDominant,
  onUpdateCard,
  onRemoveCard,
  onChangePurpose,
  onLaunchFullResource,
  onMinimizeCard,
  onShowToast,
  canRemove = false
}) => {
  const [copied, setCopied] = useState(false);
  const [purposeMenuOpen, setPurposeMenuOpen] = useState(false);

  // Lecture playback simulation state
  const [lecturePlaying, setLecturePlaying] = useState(card.lecturePlaying || false);
  const [lectureTimeSec, setLectureTimeSec] = useState(145); // e.g. 2:25
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const totalLectureSec = 900; // 15 mins

  // Slides simulation
  const [currentSlide, setCurrentSlide] = useState(card.slideCurrent || 1);

  // Milestones simulation
  const [milestones, setMilestones] = useState(
    card.milestones || [
      { id: 'm-1', text: 'Synthesize hydrophone waveform packets (§3.4)', completed: true },
      { id: 'm-2', text: 'Construct 16:9 diagram for symposium slide deck', completed: true },
      { id: 'm-3', text: 'Verify cross-attention weights for tactile transducers', completed: false },
      { id: 'm-4', text: 'Peer review with collaborators (Elena K., David L.)', completed: false }
    ]
  );
  const [newMilestoneInput, setNewMilestoneInput] = useState('');

  // Section-level minimize toggles
  const [minimizedNotesToolbar, setMinimizedNotesToolbar] = useState(false);
  const [minimizedDocHeader, setMinimizedDocHeader] = useState(false);
  const [minimizedDocComments, setMinimizedDocComments] = useState(false);
  const [minimizedAudioPlayer, setMinimizedAudioPlayer] = useState(false);
  const [minimizedTranscript, setMinimizedTranscript] = useState(false);
  const [minimizedSlideSelector, setMinimizedSlideSelector] = useState(false);
  const [minimizedMilestonesHeader, setMinimizedMilestonesHeader] = useState(false);
  const [minimizedMilestonesForm, setMinimizedMilestonesForm] = useState(false);
  const [minimizedScratchpadToolbar, setMinimizedScratchpadToolbar] = useState(false);

  // Lecture playback timer
  useEffect(() => {
    let interval: any = null;
    if (lecturePlaying && lectureTimeSec < totalLectureSec) {
      interval = setInterval(() => {
        setLectureTimeSec(prev => {
          if (prev >= totalLectureSec) {
            setLecturePlaying(false);
            return totalLectureSec;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [lecturePlaying, lectureTimeSec, playbackSpeed]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    onShowToast('Content copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const getPurposeIcon = (p: FocusCardPurpose) => {
    switch (p) {
      case 'notes':
        return <Edit3 className="w-4 h-4 text-white" />;
      case 'docs':
        return <FileText className="w-4 h-4 text-white" />;
      case 'lectures':
        return <GraduationCap className="w-4 h-4 text-white" />;
      case 'slides':
        return <Presentation className="w-4 h-4 text-white" />;
      case 'scratchpad':
        return <Edit3 className="w-4 h-4 text-white" />;
      case 'milestones':
        return <ListTodo className="w-4 h-4 text-white" />;
      case 'pdf':
      case 'journal':
      default:
        return <BookOpen className="w-4 h-4 text-white" />;
    }
  };

  const getCategoryName = (p: FocusCardPurpose) => {
    switch (p) {
      case 'notes':
        return 'Notes';
      case 'docs':
        return 'Docs';
      case 'lectures':
        return 'Lectures';
      case 'slides':
        return 'Slides';
      case 'scratchpad':
        return 'Scratchpad';
      case 'milestones':
        return 'Milestones';
      default:
        return p.toUpperCase();
    }
  };

  // ==========================================
  // MINIMIZED TAB PREVIEW (isDominant === false)
  // Strictly display ONLY the icon of the tabs
  // ==========================================
  if (!isDominant) {
    return (
      <div
        title={`${card.title} • ${getCategoryName(card.purpose)}`}
        className="flex items-center justify-center h-full w-full select-none relative group overflow-hidden"
      >
        <div className="flex items-center justify-center h-full w-full p-1">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center shrink-0 border border-neutral-700 bg-neutral-900 text-white transition-transform group-hover:scale-105"
          >
            {getPurposeIcon(card.purpose)}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // DOMINANT / LARGEST CARD VIEW (isDominant === true)
  // ==========================================
  return (
    <div className="flex flex-col h-full select-text p-3 sm:p-4 overflow-hidden font-sans">
      {/* Top Header of the Dominant Card */}
      <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2.5 mb-2.5 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded flex items-center justify-center shrink-0 border border-neutral-700 bg-neutral-900 text-white"
          >
            {getPurposeIcon(card.purpose)}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-bold border border-neutral-700 bg-neutral-800 text-white">
                [{getCategoryName(card.purpose)}]
              </span>
              <span className="text-xs text-neutral-600 hidden xs:inline">•</span>
              <span className="text-[11px] text-neutral-400 truncate hidden xs:inline">{card.subtitle}</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate mt-0.5">
              {card.title}
            </h2>
          </div>
        </div>

        {/* Card Controls & Switcher */}
        <div className="flex items-center gap-1.5 shrink-0 font-mono">
          {/* Card Minimize button */}
          {onMinimizeCard && (
            <button
              onClick={onMinimizeCard}
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
              title="Minimize this card"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Minimize</span>
            </button>
          )}

          {/* Purpose switcher menu */}
          <div className="relative">
            <button
              onClick={() => setPurposeMenuOpen(!purposeMenuOpen)}
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
              title="Change purpose of this card"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Purpose</span>
            </button>

            {purposeMenuOpen && (
              <div
                onClick={e => e.stopPropagation()}
                className="absolute top-9 right-0 z-50 bg-neutral-950 border border-neutral-700 rounded p-1 shadow-2xl space-y-0.5 w-44 animate-fade-in font-sans"
              >
                <div className="text-[10px] font-bold text-neutral-400 px-2 py-1 uppercase tracking-wider font-mono">
                  [Switch Purpose]
                </div>
                {(['notes', 'docs', 'lectures', 'slides', 'scratchpad', 'milestones'] as FocusCardPurpose[]).map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      onChangePurpose(card.id, p);
                      setPurposeMenuOpen(false);
                      onShowToast(`Switched active card to ${getCategoryName(p)}`);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs font-semibold flex items-center gap-2 transition-colors ${
                      card.purpose === p
                        ? 'bg-white text-black'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    {getPurposeIcon(p)}
                    <span>{getCategoryName(p)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Open full editor if applicable */}
          {onLaunchFullResource && (card.purpose === 'docs' || card.purpose === 'slides' || card.purpose === 'lectures' || card.purpose === 'notes') && (
            <button
              onClick={() => {
                const typeMap: Record<string, string> = {
                  docs: 'document',
                  slides: 'presentation',
                  lectures: 'lesson',
                  notes: 'notebook'
                };
                onLaunchFullResource(typeMap[card.purpose] || 'document');
              }}
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
              title="Open full studio tool"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Studio</span>
            </button>
          )}

          {canRemove && onRemoveCard && (
            <button
              onClick={() => onRemoveCard(card.id)}
              className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700 transition-colors"
              title="Remove this card"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area based on Purpose */}
      <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 space-y-3">
        {/* ========================================================= */}
        {/* PURPOSE: NOTES */}
        {/* ========================================================= */}
        {card.purpose === 'notes' && (
          <div className="flex flex-col h-full space-y-2">
            {/* Notes Toolbar with Minimize Option */}
            {minimizedNotesToolbar ? (
              <div className="flex items-center justify-between px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs shrink-0 font-mono">
                <span className="text-[11px] text-neutral-400">
                  {(card.notesContent || '').split(/\s+/).filter(Boolean).length} words • Prototype notes
                </span>
                <button
                  onClick={() => setMinimizedNotesToolbar(false)}
                  className="text-[11px] font-semibold text-white hover:underline flex items-center gap-1"
                >
                  <ChevronDown className="w-3 h-3" />
                  <span>Expand</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 p-1.5 rounded bg-neutral-900 border border-neutral-800 shrink-0 font-mono">
                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => {
                      const current = card.notesContent || '';
                      onUpdateCard(card.id, { notesContent: current + '\n**Bold Insight** ' });
                    }}
                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
                    title="Insert Bold Text"
                  >
                    B
                  </button>
                  <button
                    onClick={() => {
                      const current = card.notesContent || '';
                      onUpdateCard(card.id, { notesContent: current + '\n*Italic Note* ' });
                    }}
                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white italic text-xs"
                    title="Insert Italic"
                  >
                    I
                  </button>
                  <button
                    onClick={() => {
                      const current = card.notesContent || '';
                      onUpdateCard(card.id, { notesContent: current + '\n### Section: ' });
                    }}
                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-[11px]"
                    title="Insert Heading"
                  >
                    H3
                  </button>
                  <button
                    onClick={() => {
                      const current = card.notesContent || '';
                      onUpdateCard(card.id, { notesContent: current + '\n• Point: ' });
                    }}
                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs"
                    title="Bullet Point"
                  >
                    •
                  </button>
                  <button
                    onClick={() => {
                      const current = card.notesContent || '';
                      onUpdateCard(card.id, { notesContent: current + '\n```ts\n// Code snippet\n```\n' });
                    }}
                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-[11px]"
                    title="Code Block"
                  >
                    &lt;/&gt;
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-neutral-500 hidden xs:inline tabular-nums">
                    {(card.notesContent || '').split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    onClick={() => handleCopyText(card.notesContent || '')}
                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                    <span className="hidden xs:inline">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => setMinimizedNotesToolbar(true)}
                    className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                    title="Minimize Toolbar"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Editable Notes Body */}
            <textarea
              value={card.notesContent || ''}
              onChange={e => onUpdateCard(card.id, { notesContent: e.target.value })}
              rows={12}
              className="flex-1 w-full bg-black border border-neutral-800 rounded p-3 text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans outline-none focus:border-neutral-500 resize-none"
              placeholder="Synthesize lecture concepts, formulas, ideas, and citations in this focused card..."
            />

            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-500 shrink-0 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>Auto-saved locally</span>
              </span>
              <span>Markdown supported</span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PURPOSE: DOCS */}
        {/* ========================================================= */}
        {card.purpose === 'docs' && (
          <div className="space-y-3">
            {/* Collaborative Header Info with Minimize */}
            {minimizedDocHeader ? (
              <div className="flex items-center justify-between px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono">
                <span className="text-[11px] text-neutral-400">3 Collaborators • Sync Ready</span>
                <button
                  onClick={() => setMinimizedDocHeader(false)}
                  className="text-[11px] font-semibold text-white hover:underline flex items-center gap-1"
                >
                  <ChevronDown className="w-3 h-3" /> Expand
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded bg-neutral-900 border border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-1 font-mono">
                    <div className="w-6 h-6 rounded bg-neutral-800 border border-neutral-600 text-white flex items-center justify-center font-bold text-[10px]">
                      EK
                    </div>
                    <div className="w-6 h-6 rounded bg-neutral-700 border border-neutral-500 text-white flex items-center justify-center font-bold text-[10px]">
                      DL
                    </div>
                    <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold text-[10px]">
                      YOU
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block text-xs">3 Active Authors</span>
                    <span className="text-neutral-400 text-[10px] sm:text-[11px]">Drive Sync Protocol</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-white border border-neutral-700 text-[10px] font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    LIVE
                  </span>
                  <button
                    onClick={() => setMinimizedDocHeader(true)}
                    className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                    title="Minimize Authors Bar"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Document Body Editor */}
            <div className="p-3 rounded bg-black border border-neutral-800 space-y-2.5">
              <input
                type="text"
                value={card.title}
                onChange={e => onUpdateCard(card.id, { title: e.target.value })}
                className="w-full bg-transparent font-bold text-sm sm:text-base text-white border-b border-neutral-800 pb-1.5 outline-none focus:border-neutral-500"
                placeholder="Document Title"
              />

              <div className="p-2.5 rounded bg-neutral-900 border-l-2 border-white text-xs text-neutral-200 leading-relaxed space-y-2">
                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                  <span className="font-bold text-white">§ 3.4 Bathypelagic Audio-Haptic Architecture</span>
                  <span>Revision 8 • Draft</span>
                </div>
                <textarea
                  value={card.docContent || ''}
                  onChange={e => onUpdateCard(card.id, { docContent: e.target.value })}
                  rows={8}
                  className="w-full bg-transparent text-neutral-200 leading-relaxed outline-none border-none resize-none font-sans text-xs sm:text-sm"
                  placeholder="Draft thesis or paper content here..."
                />
              </div>

              {/* Comments stream with Minimize */}
              {minimizedDocComments ? (
                <div className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono">
                  <span className="text-[11px] text-neutral-400">Review comments (1 active)</span>
                  <button
                    onClick={() => setMinimizedDocComments(false)}
                    className="text-[11px] text-white font-semibold flex items-center gap-1 hover:underline"
                  >
                    <ChevronDown className="w-3 h-3" /> View
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-neutral-400 block">[Review Comments]</span>
                    <button
                      onClick={() => setMinimizedDocComments(true)}
                      className="text-neutral-500 hover:text-white flex items-center gap-1 text-[11px]"
                      title="Minimize comments"
                    >
                      <Minimize2 className="w-3 h-3" /> Minimize
                    </button>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-white">Elena K.:</span>
                      <p className="text-neutral-300 mt-0.5 text-xs">
                        "Specify whether frequency attenuation was calculated with freshwater or high-salinity seawater coefficients."
                      </p>
                    </div>
                    <button
                      onClick={() => onShowToast('Comment marked as resolved')}
                      className="text-[10px] px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white shrink-0 font-mono font-semibold border border-neutral-700"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PURPOSE: LECTURES */}
        {/* ========================================================= */}
        {card.purpose === 'lectures' && (
          <div className="space-y-3 font-sans">
            {/* Audio / Video HUD with Minimize */}
            {minimizedAudioPlayer ? (
              <div className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={() => setLecturePlaying(!lecturePlaying)}
                    className="w-6 h-6 rounded bg-white text-black flex items-center justify-center shrink-0"
                  >
                    {lecturePlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                  </button>
                  <span className="text-neutral-200 font-bold text-xs shrink-0 tabular-nums">
                    {formatSeconds(lectureTimeSec)} / {formatSeconds(totalLectureSec)}
                  </span>
                  <span className="text-neutral-500 text-[11px] truncate hidden sm:inline">
                    • {card.lectureTopic || 'Transformer Mechanics'}
                  </span>
                </div>
                <button
                  onClick={() => setMinimizedAudioPlayer(false)}
                  className="text-[11px] text-white font-semibold flex items-center gap-1 hover:underline shrink-0"
                >
                  <ChevronDown className="w-3 h-3" /> Expand
                </button>
              </div>
            ) : (
              <div className="rounded bg-black border border-neutral-800 p-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700">
                        [LECTURE AUDIO]
                      </span>
                      <span className="text-xs text-neutral-400 truncate">
                        {card.lectureInstructor || 'Dr. Sarah Lin'}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-1 truncate">
                      {card.lectureTopic || 'Transformer Mechanics: Self-Attention Waves'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 font-mono">
                    {[1, 1.25, 1.5, 2].map(spd => (
                      <button
                        key={spd}
                        onClick={() => {
                          setPlaybackSpeed(spd);
                          onShowToast(`Speed set to ${spd}x`);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold transition-colors ${
                          playbackSpeed === spd
                            ? 'bg-white text-black'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                    <button
                      onClick={() => setMinimizedAudioPlayer(true)}
                      className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white ml-1"
                      title="Minimize Audio Player"
                    >
                      <Minimize2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Scrubber Timeline */}
                <div className="space-y-1 font-mono">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="text-white font-bold tabular-nums">{formatSeconds(lectureTimeSec)}</span>
                    <span className="tabular-nums">{formatSeconds(totalLectureSec)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={totalLectureSec}
                    value={lectureTimeSec}
                    onChange={e => setLectureTimeSec(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer h-1.5 bg-neutral-800"
                  />
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-3 mt-3 font-mono">
                  <button
                    onClick={() => setLectureTimeSec(Math.max(0, lectureTimeSec - 15))}
                    className="p-1.5 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs"
                    title="Rewind 15 seconds"
                  >
                    -15s
                  </button>

                  <button
                    onClick={() => setLecturePlaying(!lecturePlaying)}
                    className="w-9 h-9 rounded bg-white text-black flex items-center justify-center hover:bg-neutral-200 active:scale-95 transition-all"
                  >
                    {lecturePlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={() => setLectureTimeSec(Math.min(totalLectureSec, lectureTimeSec + 30))}
                    className="p-1.5 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs"
                    title="Forward 30 seconds"
                  >
                    +30s
                  </button>
                </div>
              </div>
            )}

            {/* Synchronized Live Transcript with Minimize */}
            {minimizedTranscript ? (
              <div className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono">
                <span className="text-neutral-400 text-[11px]">Transcript (4 timecodes)</span>
                <button
                  onClick={() => setMinimizedTranscript(false)}
                  className="text-[11px] text-white font-semibold flex items-center gap-1 hover:underline"
                >
                  <ChevronDown className="w-3 h-3" /> Expand
                </button>
              </div>
            ) : (
              <div className="p-3 rounded bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-bold text-white text-xs font-mono">[TRANSCRIPT]</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-500 font-mono hidden xs:inline">Click timecode to jump</span>
                    <button
                      onClick={() => setMinimizedTranscript(true)}
                      className="text-neutral-500 hover:text-white flex items-center gap-1 text-[11px] font-mono"
                      title="Minimize Transcript"
                    >
                      <Minimize2 className="w-3 h-3" /> Minimize
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs leading-relaxed max-h-40 sm:max-h-48 overflow-y-auto pr-1">
                  {[
                    {
                      sec: 30,
                      speaker: 'Dr. Lin',
                      text: 'Let us begin with the core equation of self-attention: softmax of Q times K transpose over square root of d_k.'
                    },
                    {
                      sec: 120,
                      speaker: 'Dr. Lin',
                      text: 'Notice that without the scaling factor, large vector dot products push softmax into saturated exponential regions.'
                    },
                    {
                      sec: 240,
                      speaker: 'Dr. Lin',
                      text: 'Now look at multi-head projections. Each head maintains independent query, key, and value parameter matrices.'
                    },
                    {
                      sec: 480,
                      speaker: 'Dr. Lin',
                      text: 'In tactile audio interfaces, these matrix projections modulate piezoelectric actuators for sensory feedback.'
                    }
                  ].map((line, idx) => {
                    const isActive = lectureTimeSec >= line.sec && lectureTimeSec < line.sec + 120;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setLectureTimeSec(line.sec);
                          onShowToast(`Jumped playback to ${formatSeconds(line.sec)}`);
                        }}
                        className={`p-2 rounded cursor-pointer transition-all border ${
                          isActive
                            ? 'bg-neutral-800 border-white text-white font-medium'
                            : 'bg-black border-neutral-850 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-0.5">
                          <span className="text-white font-bold">{line.speaker}</span>
                          <span className="tabular-nums">{formatSeconds(line.sec)}</span>
                        </div>
                        <p className="text-xs">{line.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* PURPOSE: SLIDES */}
        {/* ========================================================= */}
        {card.purpose === 'slides' && (
          <div className="space-y-2.5">
            {/* 16:9 Slide Canvas with inline navigation */}
            <div className="relative w-full aspect-[16/9] max-h-[160px] sm:max-h-[220px] md:max-h-[280px] rounded overflow-hidden border border-neutral-700 bg-neutral-950 p-3 sm:p-4 flex flex-col justify-between shrink-0 font-sans">
              <div className="flex items-center justify-between font-mono">
                <span className="px-2 py-0.5 rounded bg-neutral-900 text-white text-[10px] sm:text-xs font-bold border border-neutral-700">
                  Slide {currentSlide} of 4
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentSlide(prev => Math.max(1, prev - 1))}
                    disabled={currentSlide <= 1}
                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white text-[10px] font-bold"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentSlide(prev => Math.min(4, prev + 1))}
                    disabled={currentSlide >= 4}
                    className="px-2 py-0.5 rounded bg-white text-black text-[10px] font-bold disabled:opacity-30 hover:bg-neutral-200"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="max-w-lg my-auto">
                {currentSlide === 1 && (
                  <>
                    <h3 className="text-xs sm:text-base md:text-lg font-bold text-white tracking-tight line-clamp-1">
                      Deep Oceanic UI: Spatial Architecture
                    </h3>
                    <p className="text-[10px] sm:text-xs text-neutral-300 mt-1 leading-snug line-clamp-2">
                      Consolidating multi-tool cognitive focus through glassmorphic concealment and zero-context-switching workflows.
                    </p>
                  </>
                )}
                {currentSlide === 2 && (
                  <>
                    <h3 className="text-xs sm:text-base md:text-lg font-bold text-white tracking-tight line-clamp-1">
                      The 4-Card Focus Shift Doctrine
                    </h3>
                    <p className="text-[10px] sm:text-xs text-neutral-300 mt-1 leading-snug line-clamp-2">
                      Human working memory is bounded at 4 distinct chunking items. Limiting workspace cards to 4 prevents cognitive depletion.
                    </p>
                  </>
                )}
                {currentSlide === 3 && (
                  <>
                    <h3 className="text-xs sm:text-base md:text-lg font-bold text-white tracking-tight line-clamp-1">
                      Tactile Sonar & Hydrophone Waves
                    </h3>
                    <p className="text-[10px] sm:text-xs text-neutral-300 mt-1 leading-snug line-clamp-2">
                      Transforming high-impedance oceanic frequencies into sub-1ms physical impulses for human mechanoreceptors.
                    </p>
                  </>
                )}
                {currentSlide === 4 && (
                  <>
                    <h3 className="text-xs sm:text-base md:text-lg font-bold text-white tracking-tight line-clamp-1">
                      Symposium Recommendations & Impact
                    </h3>
                    <p className="text-[10px] sm:text-xs text-neutral-300 mt-1 leading-snug line-clamp-2">
                      Zero-drift cloud synchronization verified. Complete ecosystem unified across Notion, Google Docs, and Canva.
                    </p>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-neutral-800 text-[9px] sm:text-[10px] text-neutral-400 font-mono">
                <span>Canva Deck Synced</span>
                <span className="text-white font-bold">[READY]</span>
              </div>
            </div>

            {/* Slide Selector strip with Minimize */}
            {minimizedSlideSelector ? (
              <div className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono">
                <span className="text-neutral-400 text-[11px]">Slide Deck Strip (Slide {currentSlide} of 4)</span>
                <button
                  onClick={() => setMinimizedSlideSelector(false)}
                  className="text-[11px] text-white font-semibold flex items-center gap-1 hover:underline"
                >
                  <ChevronDown className="w-3 h-3" /> Show Thumbnails
                </button>
              </div>
            ) : (
              <div className="space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
                  <span>[Slide Thumbnails]</span>
                  <button
                    onClick={() => setMinimizedSlideSelector(true)}
                    className="hover:text-white flex items-center gap-1"
                    title="Minimize Thumbnails"
                  >
                    <Minimize2 className="w-3 h-3" /> Minimize
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { num: 1, label: 'Title Deck' },
                    { num: 2, label: '4-Card Doctrine' },
                    { num: 3, label: 'Tactile Sonar' },
                    { num: 4, label: 'Conclusion' }
                  ].map(s => (
                    <button
                      key={s.num}
                      onClick={() => setCurrentSlide(s.num)}
                      className={`p-1.5 rounded text-left border transition-all text-xs ${
                        currentSlide === s.num
                          ? 'bg-neutral-800 border-white text-white'
                          : 'bg-black border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="text-[9px] text-neutral-300 block font-bold">Slide {s.num}</span>
                      <span className="font-medium truncate block text-[10px] mt-0.5">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* PURPOSE: MILESTONES */}
        {/* ========================================================= */}
        {card.purpose === 'milestones' && (
          <div className="space-y-3 font-sans">
            {/* Progress Bar Header with Minimize */}
            {minimizedMilestonesHeader ? (
              <div className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono">
                <span className="text-[11px] text-neutral-400">
                  Sprint: {milestones.filter(m => m.completed).length}/{milestones.length} Completed
                </span>
                <button
                  onClick={() => setMinimizedMilestonesHeader(false)}
                  className="text-[11px] text-white font-semibold flex items-center gap-1 hover:underline"
                >
                  <ChevronDown className="w-3 h-3" /> Expand
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded bg-neutral-900 border border-neutral-800">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Deliverables: {milestones.filter(m => m.completed).length} of {milestones.length} Finished
                  </span>
                  <div className="w-32 sm:w-48 h-1.5 bg-neutral-800 rounded mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all"
                      style={{ width: `${(milestones.filter(m => m.completed).length / (milestones.length || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs font-bold text-white tabular-nums">
                    {Math.round((milestones.filter(m => m.completed).length / (milestones.length || 1)) * 100)}%
                  </span>
                  <button
                    onClick={() => setMinimizedMilestonesHeader(true)}
                    className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                    title="Minimize Progress Bar"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Milestones List */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {milestones.map(m => (
                <div
                  key={m.id}
                  onClick={() => {
                    const updated = milestones.map(item =>
                      item.id === m.id ? { ...item, completed: !item.completed } : item
                    );
                    setMilestones(updated);
                    onUpdateCard(card.id, { milestones: updated });
                  }}
                  className={`p-2.5 rounded border flex items-center justify-between cursor-pointer transition-all text-xs ${
                    m.completed
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-500 line-through'
                      : 'bg-black border-neutral-800 text-neutral-200 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${m.completed ? 'text-white' : 'text-neutral-600'}`} />
                    <span className="truncate">{m.text}</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 ml-2 shrink-0">
                    {m.completed ? '[DONE]' : '[PENDING]'}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Deliverable Form with Minimize */}
            {minimizedMilestonesForm ? (
              <button
                onClick={() => setMinimizedMilestonesForm(false)}
                className="w-full py-2 rounded bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs text-neutral-300 hover:text-white flex items-center justify-center gap-1.5 font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!newMilestoneInput.trim()) return;
                  const next = [
                    ...milestones,
                    { id: `m-${Date.now()}`, text: newMilestoneInput.trim(), completed: false }
                  ];
                  setMilestones(next);
                  onUpdateCard(card.id, { milestones: next });
                  setNewMilestoneInput('');
                  onShowToast('Deliverable added');
                }}
                className="flex items-center gap-1.5 pt-1"
              >
                <input
                  type="text"
                  placeholder="Add new action item or sprint deliverable..."
                  value={newMilestoneInput}
                  onChange={e => setNewMilestoneInput(e.target.value)}
                  className="flex-1 bg-black border border-neutral-800 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-neutral-500 font-sans"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-white text-black font-bold text-xs hover:bg-neutral-200 flex items-center gap-1 shrink-0 font-mono"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMinimizedMilestonesForm(true)}
                  className="p-1.5 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white"
                  title="Minimize Add Form"
                >
                  <Minimize2 className="w-3 h-3" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* PURPOSE: SCRATCHPAD */}
        {/* ========================================================= */}
        {card.purpose === 'scratchpad' && (
          <div className="space-y-2.5 h-full flex flex-col font-sans">
            {/* Scratchpad Toolbar with Minimize */}
            {minimizedScratchpadToolbar ? (
              <div className="flex items-center justify-between px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs shrink-0 font-mono">
                <span className="text-[11px] text-neutral-400">Workspace Scratchpad</span>
                <button
                  onClick={() => setMinimizedScratchpadToolbar(false)}
                  className="text-[11px] font-semibold text-white hover:underline flex items-center gap-1"
                >
                  <ChevronDown className="w-3 h-3" /> Expand
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 p-2 rounded bg-neutral-900 border border-neutral-800 shrink-0 font-mono">
                <span className="text-xs font-semibold text-white">[RAPID SCRATCHPAD]</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyText(card.scratchpadText || '')}
                    className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => setMinimizedScratchpadToolbar(true)}
                    className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                    title="Minimize Toolbar"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            <textarea
              value={card.scratchpadText || ''}
              onChange={e => onUpdateCard(card.id, { scratchpadText: e.target.value })}
              rows={10}
              className="flex-1 w-full bg-black border border-neutral-800 rounded p-3 text-xs sm:text-sm text-neutral-200 outline-none focus:border-neutral-500 leading-relaxed font-mono resize-none"
              placeholder="Drop rough formulas, sudden ideas, thesis brainstorms..."
            />
          </div>
        )}
      </div>
    </div>
  );
};
