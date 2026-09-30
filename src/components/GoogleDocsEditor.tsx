import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Star,
  Pin,
  CloudCheck,
  Share2,
  MessageSquare,
  Video,
  Undo,
  Redo,
  Printer,
  SpellCheck,
  Paintbrush,
  Bold,
  Italic,
  Underline,
  Highlighter,
  Link,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListChecks,
  Outdent,
  Indent,
  RemoveFormatting,
  Mic,
  Maximize2,
  Minimize2,
  X,
  ChevronDown,
  Check,
  Send,
  Download,
  Copy,
  Table as TableIcon
} from 'lucide-react';
import { ResourceItem } from '../types';
import { BadgeSelector } from './BadgeSelector';

interface GoogleDocsEditorProps {
  document: ResourceItem;
  onClose: () => void;
  onUpdateDocument: (updated: Partial<ResourceItem>) => void;
  onShowToast: (msg: string) => void;
}

export const GoogleDocsEditor: React.FC<GoogleDocsEditorProps> = ({
  document,
  onClose,
  onUpdateDocument,
  onShowToast
}) => {
  const [isMaximized, setIsMaximized] = useState(true);
  const [title, setTitle] = useState(document.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showBadgePicker, setShowBadgePicker] = useState(false);
  const [zoom, setZoom] = useState('100%');
  const [fontFamily, setFontFamily] = useState('Helvetica');
  const [fontSize, setFontSize] = useState(11);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textColor, setTextColor] = useState('#1e293b');
  const [highlightColor, setHighlightColor] = useState('transparent');
  const [align, setAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [isListening, setIsListening] = useState(false);
  const [showOutline, setShowOutline] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [comments, setComments] = useState(
    document.metadata.comments || [
      { id: 'c-1', author: 'Elena K.', text: 'Equation 4.2 needs an explicit mention of seawater salinity compensation.', time: '14m ago', resolved: false },
      { id: 'c-2', author: 'David L.', text: 'The tactile clarity score on line 18 aligns with our wet-lab tests!', time: '1h ago', resolved: true }
    ]
  );
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const applyFormatting = (command: string, value: string | undefined = undefined) => {
    window.document.execCommand?.(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    onUpdateDocument({ title });
    onShowToast(`Document renamed to "${title}"`);
  };

  const togglePin = () => {
    const next = !document.isPinned;
    onUpdateDocument({ isPinned: next });
    onShowToast(next ? '📌 Pinned to Learning Hub' : 'Unpinned from Hub');
  };

  const toggleFavorite = () => {
    const next = !document.isFavorite;
    onUpdateDocument({ isFavorite: next });
    onShowToast(next ? '⭐ Starred document' : 'Removed from Starred');
  };

  const handleSelectBadge = (badge: string) => {
    onUpdateDocument({ badge });
    setShowBadgePicker(false);
    onShowToast(`Badge set to ${badge}`);
  };

  const addComment = () => {
    if (!newCommentText.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: 'You',
      text: newCommentText.trim(),
      time: 'Just now',
      resolved: false
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    setNewCommentText('');
    onUpdateDocument({
      metadata: { ...document.metadata, comments: updated }
    });
    onShowToast('Comment posted to draft');
  };

  const toggleResolveComment = (id: string) => {
    const updated = comments.map(c => (c.id === id ? { ...c, resolved: !c.resolved } : c));
    setComments(updated);
    onUpdateDocument({
      metadata: { ...document.metadata, comments: updated }
    });
    onShowToast('Comment updated');
  };

  const handleExport = (format: string) => {
    onShowToast(`Downloading "${title}" as ${format.toUpperCase()}...`);
  };

  const toggleVoiceTyping = () => {
    setIsListening(prev => {
      const next = !prev;
      onShowToast(next ? '🎤 Voice typing active. Speak now...' : 'Voice typing paused.');
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-2 bg-black/80 backdrop-blur-md overflow-hidden">
      <motion.div
        layout
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className={`bg-neutral-100 text-neutral-900 flex flex-col shadow-2xl overflow-hidden transition-all duration-300 font-sans ${
          isMaximized
            ? 'w-full h-full rounded-none sm:rounded-lg border border-neutral-700'
            : 'w-full max-w-5xl h-[88vh] rounded-lg border border-neutral-700'
        }`}
      >
        {/* TOP ROW: Document Title Bar */}
        <div className="bg-neutral-200 border-b border-neutral-300 px-4 py-2 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Document Icon */}
            <div className="w-9 h-9 rounded bg-black flex items-center justify-center text-white shrink-0 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>

            <div className="flex flex-col min-w-0">
              {/* Title & Star / Pin / Badge */}
              <div className="flex items-center gap-2">
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={e => e.key === 'Enter' && handleTitleBlur()}
                    autoFocus
                    className="text-base font-bold text-neutral-900 bg-white border border-black px-1.5 py-0.5 rounded outline-none w-64 sm:w-80"
                  />
                ) : (
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="text-base font-bold text-neutral-900 hover:bg-black/5 px-1.5 py-0.5 rounded transition-all truncate text-left"
                    title="Click to rename document"
                  >
                    {title}
                  </button>
                )}

                {/* Star Button */}
                <button
                  onClick={toggleFavorite}
                  className={`p-1 rounded hover:bg-black/5 transition-all ${
                    document.isFavorite ? 'text-black fill-black' : 'text-neutral-400'
                  }`}
                  title={document.isFavorite ? 'Starred' : 'Not starred'}
                >
                  <Star className={`w-4 h-4 ${document.isFavorite ? 'fill-current' : ''}`} />
                </button>

                {/* Pin Button */}
                <button
                  onClick={togglePin}
                  className={`p-1 rounded hover:bg-black/5 transition-all ${
                    document.isPinned ? 'text-black fill-black' : 'text-neutral-400'
                  }`}
                  title={document.isPinned ? 'Pinned to Hub' : 'Pin to Hub'}
                >
                  <Pin className={`w-4 h-4 ${document.isPinned ? 'fill-current' : ''}`} />
                </button>

                {/* Status Badge */}
                <div className="relative">
                  <button
                    onClick={() => setShowBadgePicker(!showBadgePicker)}
                    className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-white text-black border border-neutral-300 hover:bg-neutral-50 flex items-center gap-1 transition-all"
                  >
                    <span>{document.badge || '★ Favorite'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showBadgePicker && (
                    <div className="absolute top-full left-0 mt-1 z-50">
                      <BadgeSelector
                        currentBadge={document.badge}
                        isPinned={document.isPinned}
                        isFavorite={document.isFavorite}
                        onSelectBadge={handleSelectBadge}
                        onTogglePin={togglePin}
                        onToggleFavorite={toggleFavorite}
                        onClose={() => setShowBadgePicker(false)}
                      />
                    </div>
                  )}
                </div>

                {/* Cloud Save Indicator */}
                <div className="hidden md:flex items-center gap-1 text-[11px] text-gray-500 pl-2">
                  <CloudCheck className="w-4 h-4 text-emerald-600" />
                  <span>Saved to Drive</span>
                </div>
              </div>

              {/* Menubar (File, Edit, View, Insert, Format, Tools, Extensions, Help) */}
              <div className="flex items-center gap-0.5 text-xs text-gray-700 -ml-1 mt-0.5 overflow-x-auto no-scrollbar">
                {['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Extensions', 'Help'].map(menu => (
                  <div key={menu} className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                      className={`px-2 py-0.5 rounded hover:bg-black/5 font-medium transition-all ${
                        activeMenu === menu ? 'bg-black/10 font-bold' : ''
                      }`}
                    >
                      {menu}
                    </button>

                    {activeMenu === menu && (
                      <div
                        onClick={() => setActiveMenu(null)}
                        className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 text-gray-800 text-xs"
                      >
                        {menu === 'File' && (
                          <>
                            <button onClick={() => onShowToast('New document created')} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe] flex items-center justify-between">
                              <span>New</span> <span className="text-gray-400">Ctrl+N</span>
                            </button>
                            <button onClick={() => onShowToast('Copy generated')} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe]">Make a copy</button>
                            <div className="border-t border-gray-100 my-1" />
                            <button onClick={() => handleExport('pdf')} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe] flex items-center gap-2">
                              <Download className="w-3.5 h-3.5" /> Download PDF (.pdf)
                            </button>
                            <button onClick={() => handleExport('docx')} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe] flex items-center gap-2">
                              <Download className="w-3.5 h-3.5" /> Download Word (.docx)
                            </button>
                            <button onClick={() => handleExport('md')} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe] flex items-center gap-2">
                              <Download className="w-3.5 h-3.5" /> Markdown (.md)
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            <button onClick={() => onShowToast('Print dialog simulated')} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe] flex items-center justify-between">
                              <span>Print</span> <span className="text-gray-400">Ctrl+P</span>
                            </button>
                          </>
                        )}
                        {menu === 'Edit' && (
                          <>
                            <button onClick={() => applyFormatting('undo')} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe]">Undo</button>
                            <button onClick={() => applyFormatting('redo')} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe]">Redo</button>
                            <button onClick={() => onShowToast('Copied to clipboard')} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe]">Copy</button>
                            <button onClick={() => onShowToast('Select all')} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe]">Select All</button>
                          </>
                        )}
                        {menu === 'View' && (
                          <>
                            <button onClick={() => setShowOutline(!showOutline)} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe] flex items-center justify-between">
                              <span>Show Outline</span> <span>{showOutline ? '✓' : ''}</span>
                            </button>
                            <button onClick={() => setShowComments(!showComments)} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe] flex items-center justify-between">
                              <span>Show Comments</span> <span>{showComments ? '✓' : ''}</span>
                            </button>
                          </>
                        )}
                        {menu === 'Insert' && (
                          <>
                            <button onClick={() => applyFormatting('insertHorizontalRule')} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe]">Horizontal Line</button>
                            <button onClick={() => applyFormatting('insertParagraph')} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe]">Page Break</button>
                            <button onClick={() => onShowToast('Table inserted')} className="w-full text-left px-3 py-1.5 hover:bg-[#e8f0fe]">Table 3x3</button>
                          </>
                        )}
                        {menu !== 'File' && menu !== 'Edit' && menu !== 'View' && menu !== 'Insert' && (
                          <div className="px-3 py-2 text-gray-500 text-center">
                            Standard {menu} tools active
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Collaborator Avatars, Share, Present & Controls */}
          <div className="flex items-center gap-2">
            {/* Collaborator Avatars */}
            <div className="hidden sm:flex items-center -space-x-1.5">
              <div className="w-7 h-7 rounded-full bg-[#00f2fe] text-black font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-sm" title="Elena K. (Viewing §3.4)">
                EK
              </div>
              <div className="w-7 h-7 rounded-full bg-[#fcb88b] text-black font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-sm" title="David L. (Editing Table 2)">
                DL
              </div>
              <div className="w-7 h-7 rounded-full bg-[#a259ff] text-white font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-sm" title="You (Author)">
                You
              </div>
            </div>

            {/* Comment Sidebar Toggle */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={`p-2 rounded-full hover:bg-black/5 transition-all relative ${
                showComments ? 'text-[#1967d2] bg-[#e8f0fe]' : 'text-gray-600'
              }`}
              title="Toggle Comments"
            >
              <MessageSquare className="w-5 h-5" />
              {comments.filter(c => !c.resolved).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#1967d2]" />
              )}
            </button>

            {/* Share Button */}
            <button
              onClick={() => onShowToast('Share link copied to clipboard!')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#c2e7ff] text-[#001d35] font-semibold text-xs hover:bg-[#b3dcf7] transition-all shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            {/* Maximize / Minimize Animation Toggle */}
            <button
              onClick={() => {
                setIsMaximized(!isMaximized);
                onShowToast(isMaximized ? 'Minimized Docs View' : 'Maximized Clean Clarity View');
              }}
              className="p-2 rounded-lg hover:bg-black/5 text-gray-600 hover:text-black transition-all"
              title={isMaximized ? 'Minimize window' : 'Maximize window'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-rose-50 text-gray-500 hover:text-rose-600 transition-all"
              title="Close Document"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECOND ROW: Google Docs Formatting Toolbar */}
        <div className="bg-[#edf2fa] border-b border-[#d3e3fd] px-3 py-1 flex items-center gap-1 overflow-x-auto text-gray-700 shrink-0 select-none">
          {/* Undo / Redo */}
          <button onClick={() => applyFormatting('undo')} className="p-1.5 rounded hover:bg-black/10" title="Undo (Ctrl+Z)">
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => applyFormatting('redo')} className="p-1.5 rounded hover:bg-black/10" title="Redo (Ctrl+Y)">
            <Redo className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onShowToast('Print dialog ready')} className="p-1.5 rounded hover:bg-black/10" title="Print">
            <Printer className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onShowToast('No spelling errors found')} className="p-1.5 rounded hover:bg-black/10" title="Spelling and grammar check">
            <SpellCheck className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => applyFormatting('copy')} className="p-1.5 rounded hover:bg-black/10" title="Paint format">
            <Paintbrush className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          {/* Zoom Level */}
          <select
            value={zoom}
            onChange={e => setZoom(e.target.value)}
            className="text-xs bg-transparent border-0 rounded px-1 py-1 font-medium hover:bg-black/5 cursor-pointer outline-none"
          >
            <option value="50%">50%</option>
            <option value="75%">75%</option>
            <option value="90%">90%</option>
            <option value="100%">100%</option>
            <option value="125%">125%</option>
            <option value="150%">150%</option>
          </select>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          {/* Paragraph Style Dropdown */}
          <select
            onChange={e => applyFormatting('formatBlock', e.target.value)}
            className="text-xs bg-transparent border-0 rounded px-1.5 py-1 font-medium hover:bg-black/5 cursor-pointer outline-none w-28"
          >
            <option value="p">Normal text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          {/* Font Family */}
          <select
            value={fontFamily}
            onChange={e => {
              setFontFamily(e.target.value);
              applyFormatting('fontName', e.target.value);
            }}
            className="text-xs bg-transparent border-0 rounded px-1.5 py-1 font-medium hover:bg-black/5 cursor-pointer outline-none w-32"
          >
            <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
            <option value="Inter">Inter</option>
            <option value="Merriweather">Merriweather</option>
            <option value="Space Grotesk">Space Grotesk</option>
            <option value="Roboto">Roboto</option>
            <option value="Georgia">Georgia</option>
          </select>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          {/* Font Size */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const next = Math.max(8, fontSize - 1);
                setFontSize(next);
                applyFormatting('fontSize', '2');
              }}
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/10 font-bold"
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-semibold">{fontSize}</span>
            <button
              onClick={() => {
                const next = Math.min(36, fontSize + 1);
                setFontSize(next);
                applyFormatting('fontSize', '4');
              }}
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/10 font-bold"
            >
              +
            </button>
          </div>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          {/* Bold, Italic, Underline */}
          <button
            onClick={() => {
              setIsBold(!isBold);
              applyFormatting('bold');
            }}
            className={`p-1.5 rounded hover:bg-black/10 ${isBold ? 'bg-[#d3e3fd] text-[#001d35]' : ''}`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setIsItalic(!isItalic);
              applyFormatting('italic');
            }}
            className={`p-1.5 rounded hover:bg-black/10 ${isItalic ? 'bg-[#d3e3fd] text-[#001d35]' : ''}`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setIsUnderline(!isUnderline);
              applyFormatting('underline');
            }}
            className={`p-1.5 rounded hover:bg-black/10 ${isUnderline ? 'bg-[#d3e3fd] text-[#001d35]' : ''}`}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          {/* Text Color & Highlight */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => applyFormatting('foreColor', '#1967d2')}
              className="p-1.5 rounded hover:bg-black/10 font-bold text-xs"
              title="Text color"
            >
              <span className="border-b-2 border-[#1967d2]">A</span>
            </button>
            <button
              onClick={() => applyFormatting('hiliteColor', '#fff3cd')}
              className="p-1.5 rounded hover:bg-black/10"
              title="Highlight color"
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-500" />
            </button>
          </div>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          {/* Alignment */}
          <button
            onClick={() => {
              setAlign('left');
              applyFormatting('justifyLeft');
            }}
            className={`p-1.5 rounded hover:bg-black/10 ${align === 'left' ? 'bg-[#d3e3fd]' : ''}`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setAlign('center');
              applyFormatting('justifyCenter');
            }}
            className={`p-1.5 rounded hover:bg-black/10 ${align === 'center' ? 'bg-[#d3e3fd]' : ''}`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setAlign('right');
              applyFormatting('justifyRight');
            }}
            className={`p-1.5 rounded hover:bg-black/10 ${align === 'right' ? 'bg-[#d3e3fd]' : ''}`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setAlign('justify');
              applyFormatting('justifyFull');
            }}
            className={`p-1.5 rounded hover:bg-black/10 ${align === 'justify' ? 'bg-[#d3e3fd]' : ''}`}
            title="Justify"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          {/* Lists & Indentation */}
          <button onClick={() => applyFormatting('insertUnorderedList')} className="p-1.5 rounded hover:bg-black/10" title="Bulleted list">
            <List className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => applyFormatting('insertOrderedList')} className="p-1.5 rounded hover:bg-black/10" title="Numbered list">
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onShowToast('Checklist item inserted')} className="p-1.5 rounded hover:bg-black/10" title="Checklist">
            <ListChecks className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => applyFormatting('outdent')} className="p-1.5 rounded hover:bg-black/10" title="Decrease indent">
            <Outdent className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => applyFormatting('indent')} className="p-1.5 rounded hover:bg-black/10" title="Increase indent">
            <Indent className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => applyFormatting('removeFormat')} className="p-1.5 rounded hover:bg-black/10" title="Clear formatting">
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          {/* Voice Typing */}
          <button
            onClick={toggleVoiceTyping}
            className={`p-1.5 rounded flex items-center gap-1 text-xs transition-all ${
              isListening ? 'bg-rose-500 text-white animate-pulse' : 'hover:bg-black/10'
            }`}
            title="Voice typing"
          >
            <Mic className="w-3.5 h-3.5" />
            {isListening && <span className="text-[10px] font-bold">Listening...</span>}
          </button>
        </div>

        {/* WORKSPACE MAIN AREA: Outline + Document Canvas + Comments */}
        <div className="flex-1 flex overflow-hidden bg-[#f0f4f9] relative">
          {/* LEFT OUTLINE DRAWER */}
          {showOutline && (
            <div className="w-56 bg-white border-r border-[#e1e3e1] p-3 hidden lg:flex flex-col text-xs shrink-0 overflow-y-auto">
              <div className="flex items-center justify-between font-bold text-gray-700 pb-2 border-b border-gray-100 mb-2">
                <span>Document Outline</span>
                <button onClick={() => setShowOutline(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-2">
                <a href="#section-title" className="block text-[#1967d2] font-semibold hover:underline truncate">
                  § 3.4 Bathypelagic Audio-Haptic Feedback
                </a>
                <a href="#section-tuning" className="block text-gray-600 hover:text-gray-900 pl-2 truncate">
                  1. Frequency Decimation & Tuning
                </a>
                <a href="#section-benchmark" className="block text-gray-600 hover:text-gray-900 pl-2 truncate">
                  2. Collaborative Benchmark Table
                </a>
                <a href="#section-checkpoints" className="block text-gray-600 hover:text-gray-900 pl-2 truncate">
                  3. Experimental Checkpoints
                </a>
              </div>
              <div className="mt-auto pt-3 border-t border-gray-100 text-[11px] text-gray-400">
                <span>Words: 1,420</span> • <span>Characters: 8,940</span>
              </div>
            </div>
          )}

          {/* CENTER: Google Docs Paginated Paper Sheet */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center no-scrollbar">
            <div
              style={{
                fontFamily: fontFamily,
                transform: `scale(${parseInt(zoom) / 100})`,
                transformOrigin: 'top center'
              }}
              className="w-full max-w-[816px] min-h-[1056px] bg-white text-[#1f1f1f] shadow-[0_4px_24px_rgba(0,0,0,0.1)] rounded-sm p-8 sm:p-16 border border-[#e1e3e1] transition-transform duration-200 outline-none relative"
            >
              {/* Virtual Top Ruler Marker */}
              <div className="absolute top-2 inset-x-8 h-2 border-b border-gray-200 flex justify-between text-[9px] text-gray-300 font-mono select-none pointer-events-none">
                <span>| 1"</span>
                <span>| 2"</span>
                <span>| 3"</span>
                <span>| 4"</span>
                <span>| 5"</span>
                <span>| 6"</span>
                <span>| 7"</span>
              </div>

              {/* Live Collaborative Cursor Tag */}
              <div className="absolute right-12 top-28 flex items-center gap-1 bg-[#00f2fe] text-black text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none z-10 animate-bounce">
                <span>Elena K.</span>
              </div>

              {/* Editable Content Canvas */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => {
                  if (editorRef.current) {
                    onUpdateDocument({
                      metadata: { ...document.metadata, docContent: editorRef.current.innerHTML }
                    });
                  }
                }}
                dangerouslySetInnerHTML={{ __html: document.metadata.docContent || '' }}
                className="prose prose-slate max-w-none focus:outline-none min-h-[800px] leading-relaxed"
              />
            </div>
          </div>

          {/* RIGHT: Comments Sidebar */}
          {showComments && (
            <div className="w-72 bg-[#f9fbfd] border-l border-[#e1e3e1] p-3 hidden md:flex flex-col text-xs shrink-0 overflow-y-auto">
              <div className="flex items-center justify-between font-bold text-gray-700 pb-2 border-b border-gray-200 mb-2">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#1967d2]" />
                  Comments ({comments.length})
                </span>
                <button onClick={() => setShowComments(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              {/* New Comment Input */}
              <div className="bg-white rounded-xl p-2.5 border border-gray-200 shadow-sm mb-3">
                <textarea
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  placeholder="Add a comment or tag @collaborator..."
                  className="w-full text-xs p-1.5 border border-gray-100 rounded focus:border-[#4285f4] outline-none resize-none h-16"
                />
                <div className="flex justify-end mt-1">
                  <button
                    onClick={addComment}
                    className="px-3 py-1 bg-[#1967d2] text-white rounded-md text-[11px] font-semibold hover:bg-[#1558b0] transition-all flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Comment</span>
                  </button>
                </div>
              </div>

              {/* Comment Thread List */}
              <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                {comments.map(c => (
                  <div
                    key={c.id}
                    className={`p-2.5 rounded-xl border transition-all ${
                      c.resolved
                        ? 'bg-gray-50 border-gray-200 opacity-60'
                        : 'bg-white border-[#d3e3fd] shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-800 text-[11px]">{c.author}</span>
                      <span className="text-[10px] text-gray-400">{c.time}</span>
                    </div>
                    <p className="text-gray-700 text-xs leading-snug">{c.text}</p>
                    <div className="mt-2 pt-1 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => toggleResolveComment(c.id)}
                        className="text-[10px] text-[#1967d2] hover:underline font-medium flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>{c.resolved ? 'Reopen' : 'Resolve'}</span>
                      </button>
                      {c.resolved && <span className="text-[10px] text-emerald-600 font-semibold">Resolved</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM STATUS BAR */}
        <div className="bg-[#f9fbfd] border-t border-[#e1e3e1] px-4 py-1.5 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Page 1 of 3</span>
            <span className="text-gray-300">•</span>
            <span>1,420 words</span>
            <span className="text-gray-300">•</span>
            <span className="text-emerald-700 font-medium">✓ Offline auto-save active</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 font-mono">Synced with Google Drive API v3</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
