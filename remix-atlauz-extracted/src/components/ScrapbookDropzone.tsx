import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark,
  Plus,
  Trash2,
  ExternalLink,
  Code,
  FileText,
  Mic,
  Image,
  Copy,
  FolderInput,
  Sparkles,
  X,
  ArrowRight,
  Globe,
  Tag
} from 'lucide-react';
import { ScrapbookItem } from '../types';

interface ScrapbookDropzoneProps {
  isOpen: boolean;
  onClose: () => void;
  items: ScrapbookItem[];
  onAddItem: (item: ScrapbookItem) => void;
  onDeleteItem: (id: string) => void;
  onSendToDocument?: (item: ScrapbookItem) => void;
  onShowToast: (msg: string) => void;
}

export const ScrapbookDropzone: React.FC<ScrapbookDropzoneProps> = ({
  isOpen,
  onClose,
  items,
  onAddItem,
  onDeleteItem,
  onSendToDocument,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'url' | 'code' | 'text' | 'voice'>('all');
  const [draftInput, setDraftInput] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'url' | 'text' | 'code' | 'voice'>('url');

  if (!isOpen) return null;

  // Auto-parsing logic for URLs and dropzone content
  const handleStageItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftInput.trim()) return;

    let parsedType: 'url' | 'text' | 'code' | 'voice' = selectedFormat;
    let domain: string | undefined = undefined;
    let title = 'Quick Snippet';
    let preview = draftInput.trim();

    // Auto-parse URL if input begins with http or www
    if (draftInput.startsWith('http://') || draftInput.startsWith('https://') || draftInput.startsWith('www.')) {
      parsedType = 'url';
      try {
        const urlObj = new URL(draftInput.startsWith('http') ? draftInput : `https://${draftInput}`);
        domain = urlObj.hostname;
        title = `Bookmark: ${domain}`;
        preview = `Parsed bookmark link ready for direct insertion into Bento carousels.`;
      } catch {
        domain = 'external.link';
      }
    } else if (selectedFormat === 'code' || draftInput.includes('function') || draftInput.includes('const') || draftInput.includes('fn ')) {
      parsedType = 'code';
      title = 'Code Snippet (Auto-Parsed)';
    }

    const newItem: ScrapbookItem = {
      id: `sb-${Date.now()}`,
      type: parsedType,
      title: title,
      content: draftInput.trim(),
      domain: domain,
      previewText: preview,
      stagedTime: 'Just now',
      tags: ['Unfiled', parsedType.toUpperCase()]
    };

    onAddItem(newItem);
    setDraftInput('');
    onShowToast(`Staged into Glass Scrapbook [${parsedType.toUpperCase()}]`);
  };

  const filteredItems = items.filter(it => {
    if (activeTab === 'all') return true;
    return it.type === activeTab;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans select-none animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 transition-opacity backdrop-blur-sm"
      />

      {/* Slide-over Scrapbook Drawer (High-Index z-40 Panel Overlay) */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="relative w-[85vw] max-w-md h-full bg-neutral-950 border-l border-neutral-700 shadow-2xl flex flex-col z-10 text-white"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-neutral-800 border border-neutral-700 text-white">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white font-mono uppercase tracking-tight">
                  Glass Scrapbook Dropzone
                </h3>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold uppercase">
                  UNFILED
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Multi-format pasteboard: URLs, code, snippets & voice memos.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white font-mono text-xs"
          >
            [X]
          </button>
        </div>

        {/* Quick Dropzone Capture Form */}
        <form onSubmit={handleStageItem} className="p-3 bg-neutral-900 border-b border-neutral-800 space-y-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {(['url', 'text', 'code', 'voice'] as const).map(fmt => (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border transition-all ${
                  selectedFormat === fmt
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={draftInput}
              onChange={e => setDraftInput(e.target.value)}
              placeholder="Paste URL, code snippet, or thesis thought..."
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 font-mono outline-none focus:border-white"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-white text-black font-bold flex items-center gap-1 hover:bg-neutral-200 transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-black" />
              <span>Stage</span>
            </button>
          </div>
        </form>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-neutral-800 bg-neutral-950/60 font-mono text-[11px] overflow-x-auto no-scrollbar">
          {(['all', 'url', 'code', 'text', 'voice'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-0.5 rounded transition-all capitalize ${
                activeTab === tab
                  ? 'bg-white text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab} ({tab === 'all' ? items.length : items.filter(it => it.type === tab).length})
            </button>
          ))}
        </div>

        {/* Staged Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar font-mono text-xs">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-xs">
              No items staged in this filter. Paste or drop snippets above.
            </div>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-700 text-white font-bold text-[9px] uppercase">
                      [{item.type}]
                    </span>
                    <span className="font-bold text-white text-xs truncate max-w-[180px]">
                      {item.title}
                    </span>
                  </div>

                  <span className="text-[10px] text-neutral-500 shrink-0">{item.stagedTime}</span>
                </div>

                {/* Content preview */}
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800/80 text-neutral-300 font-mono text-xs whitespace-pre-wrap break-all leading-relaxed">
                  {item.content.slice(0, 240)}
                  {item.content.length > 240 && '...'}
                </div>

                {item.domain && (
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                    <Globe className="w-3 h-3 text-neutral-500" />
                    <span>Domain: {item.domain} (Metadata auto-parsed)</span>
                  </div>
                )}

                {/* Card Actions: Insert into Doc, Copy, Delete */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-800 text-[11px]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(item.content);
                        onShowToast('Snippet copied to clipboard');
                      }}
                      className="text-neutral-400 hover:text-white flex items-center gap-1"
                      title="Copy content"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>

                    {onSendToDocument && (
                      <button
                        onClick={() => {
                          onSendToDocument(item);
                          onShowToast(`Sent "${item.title}" to active Document Studio`);
                        }}
                        className="text-neutral-300 hover:text-white flex items-center gap-1"
                        title="Insert into active canvas/doc"
                      >
                        <FolderInput className="w-3 h-3" />
                        <span>Insert</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="text-neutral-600 hover:text-red-400 p-0.5"
                    title="Remove item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-900 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span>{items.length} unfiled blocks</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
