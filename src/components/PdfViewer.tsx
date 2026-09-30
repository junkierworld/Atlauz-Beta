import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Highlighter,
  Search,
  Star,
  Pin,
  Maximize2,
  Minimize2,
  X,
  Bookmark,
  ChevronDown
} from 'lucide-react';
import { ResourceItem } from '../types';
import { BadgeSelector } from './BadgeSelector';

interface PdfViewerProps {
  pdf: ResourceItem;
  onClose: () => void;
  onUpdatePdf: (updated: Partial<ResourceItem>) => void;
  onShowToast: (msg: string) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  pdf,
  onClose,
  onUpdatePdf,
  onShowToast
}) => {
  const [isMaximized, setIsMaximized] = useState(true);
  const [currentPage, setCurrentPage] = useState(pdf.metadata.currentPage || 1);
  const [zoom, setZoom] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBadgePicker, setShowBadgePicker] = useState(false);
  const [highlights, setHighlights] = useState(
    pdf.metadata.highlights || [
      { id: 'hl-1', page: 3, text: 'Attenuation coefficient alpha = 0.048 dB/km at oceanic isotherms below 4°C', note: 'Critical constant', color: '#00f2fe' }
    ]
  );

  const totalPages = pdf.metadata.pageCount || 16;

  const togglePin = () => {
    const next = !pdf.isPinned;
    onUpdatePdf({ isPinned: next });
    onShowToast(next ? '📌 Pinned PDF to Hub' : 'Unpinned PDF');
  };

  const toggleFavorite = () => {
    const next = !pdf.isFavorite;
    onUpdatePdf({ isFavorite: next });
    onShowToast(next ? '⭐ Starred PDF' : 'Removed from Starred');
  };

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
            ? 'w-full h-full rounded-none sm:rounded-xl border border-[#ff6b6b]/30'
            : 'w-full max-w-5xl h-[88vh] rounded-2xl border border-[#ff6b6b]/40'
        }`}
      >
        {/* Header */}
        <div className="bg-[#081224] border-b border-white/10 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#ff6b6b]/20 text-[#ff6b6b] flex items-center justify-center font-bold border border-[#ff6b6b]/40 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base truncate max-w-xs">{pdf.title}</span>
                <button onClick={toggleFavorite} className="text-amber-400">
                  <Star className={`w-4 h-4 ${pdf.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button onClick={togglePin} className="text-[#00f2fe]">
                  <Pin className={`w-4 h-4 ${pdf.isPinned ? 'fill-current' : ''}`} />
                </button>

                {/* Badge selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowBadgePicker(!showBadgePicker)}
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ff6b6b]/15 text-[#ff6b6b] border border-[#ff6b6b]/30 flex items-center gap-1"
                  >
                    <span>{pdf.badge || '🧪 Research'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showBadgePicker && (
                    <div className="absolute top-full left-0 mt-1 z-50">
                      <BadgeSelector
                        currentBadge={pdf.badge}
                        isPinned={pdf.isPinned}
                        isFavorite={pdf.isFavorite}
                        onSelectBadge={b => {
                          onUpdatePdf({ badge: b });
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
              <span className="text-xs text-white/50">{pdf.metadata.fileName} • {pdf.metadata.fileSize}</span>
            </div>
          </div>

          {/* PDF Controls */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden sm:flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/10 text-xs">
              <Search className="w-3.5 h-3.5 text-white/50" />
              <input
                type="text"
                placeholder="Find in PDF..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-white outline-none w-24"
              />
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/10 text-xs">
              <button onClick={() => setZoom(Math.max(60, zoom - 15))} className="hover:text-[#00f2fe]">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-10 text-center">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(200, zoom + 15))} className="hover:text-[#00f2fe]">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Page Jumper */}
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/10 text-xs font-mono">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="hover:text-[#00f2fe] disabled:opacity-30"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="hover:text-[#00f2fe] disabled:opacity-30"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

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

        {/* PDF Main Viewer: Thumbnails on Left + Sheet on Right */}
        <div className="flex-1 flex overflow-hidden">
          {/* Page Thumbnails */}
          <div className="w-40 bg-[#081224] border-r border-white/10 p-3 hidden sm:flex flex-col gap-3 overflow-y-auto shrink-0 select-none">
            <span className="text-[10px] text-white/50 font-bold uppercase">Pages ({totalPages})</span>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
              <button
                key={pNum}
                onClick={() => setCurrentPage(pNum)}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  pNum === currentPage
                    ? 'border-[#ff6b6b] bg-[#ff6b6b]/10'
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="w-full aspect-[1/1.3] bg-white rounded flex items-center justify-center text-gray-400 text-xs shadow">
                  P.{pNum}
                </div>
                <span className="text-[10px] text-white/60 font-mono">Page {pNum}</span>
              </button>
            ))}
          </div>

          {/* PDF Page Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start bg-[#050b17]">
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center'
              }}
              className="w-full max-w-2xl bg-white text-gray-900 rounded shadow-2xl p-8 sm:p-14 border border-gray-300 min-h-[900px] transition-transform duration-200"
            >
              <div className="flex justify-between border-b pb-4 mb-6 text-xs text-gray-500">
                <span className="font-mono">MARIANA TRENCH OCEANOGRAPHIC INSTITUTION</span>
                <span className="font-mono">DOC-ID: MT-492-AC</span>
              </div>

              <h1 className="text-xl font-black text-gray-900 mb-2">
                Hadal Acoustic Propagation & Waveform Compression v4.2
              </h1>
              <p className="text-xs text-gray-600 mb-6">
                Section 4: High-Pressure Hydrophone Array Characteristics at 11,000 Meters Depth.
              </p>

              {/* Sample PDF text highlighting */}
              <div className="space-y-4 text-xs leading-relaxed text-gray-800">
                <p>
                  Underwater acoustic propagation within deep oceanic trenches is strongly influenced by temperature, salinity, and hydrostatic pressure profiles. The sound speed minimum creates the Deep Sound Channel (SOFAR), which acts as a waveguide for low-frequency signals over thousands of kilometers.
                </p>

                <div className="p-3 bg-[#fff3cd] border-l-4 border-amber-400 rounded-r text-gray-900 font-medium">
                  Highlight (Elena K.): "Attenuation coefficient alpha = 0.048 dB/km at oceanic isotherms below 4°C is the governing limit for bathypelagic haptic transmission."
                </div>

                <p>
                  Experimental validation was conducted using synthetic hydrophone array transducers positioned at Challenger Deep. Transduced signals showed 98.4% correlation with laboratory calibration models.
                </p>
              </div>

              <div className="mt-20 pt-6 border-t flex justify-between text-[11px] text-gray-400">
                <span>Page {currentPage} of {totalPages}</span>
                <span>CONFIDENTIAL • STUDENT RESEARCH DRAFT</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
