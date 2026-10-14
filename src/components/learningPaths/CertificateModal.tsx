import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Check, Copy, Printer, ShieldCheck, Sparkles, Waves } from 'lucide-react';
import { EarnedCertificate } from '../../types/learningPath';
import { AtlauzLogo } from '../AtlauzLogo';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: EarnedCertificate | null;
  onShowToast: (msg: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificate,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !certificate) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certificate.verificationHash);
    setCopied(true);
    onShowToast(`📋 Copied verification hash: ${certificate.verificationHash}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none font-sans overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          className="relative w-full max-w-2xl bg-[#0a0a0a] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-auto"
        >
          {/* Top Actions Bar */}
          <div className="px-6 py-4 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-mono font-bold uppercase text-neutral-300 tracking-wider">
                ATLAUZ VERIFIED ACCREDITATION
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                aria-label="Close certificate modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Certificate Canvas Body */}
          <div className="p-6 sm:p-10 relative bg-[#070707] text-white">
            {/* Architectural Border & Watermark Grid */}
            <div className="border-2 border-neutral-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden bg-gradient-to-b from-neutral-950/80 to-black">
              {/* Subtle Corner Accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-500/60" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-500/60" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-500/60" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-500/60" />

              {/* Certificate Header */}
              <div className="text-center space-y-3">
                <div className="flex justify-center items-center gap-2">
                  <AtlauzLogo variant="icon" size={28} animated={false} />
                  <span className="font-mono text-sm tracking-widest text-neutral-400 font-bold uppercase">
                    ATLAUZ HIGHER ACADEMY
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-amber-400 font-semibold block">
                    CERTIFICATE OF CURRICULAR MASTERY
                  </span>
                  <h2 className="text-xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
                    {certificate.pathTitle}
                  </h2>
                </div>
              </div>

              {/* Recipient Attribution */}
              <div className="my-6 text-center space-y-2">
                <p className="text-xs text-neutral-400 font-sans italic">
                  This official credential verifies that scholar
                </p>
                <div className="inline-block px-6 py-2 border-b-2 border-neutral-700">
                  <span className="text-lg sm:text-2xl font-bold font-mono tracking-wide text-white">
                    @{certificate.studentName}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed pt-1">
                  has successfully passed all module requirements, conceptual knowledge verifications, and academic milestones with honor standing:
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{certificate.honorLevel}</span>
                </div>
              </div>

              {/* Signatures & Seal Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-850 items-center text-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                    Issued Date
                  </span>
                  <span className="text-xs font-mono font-semibold text-neutral-300">
                    {certificate.issuedAt}
                  </span>
                </div>

                {/* Golden Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 text-black flex items-center justify-center shadow-lg border-2 border-amber-300/80">
                    <Award className="w-7 h-7 text-black stroke-[2.5]" />
                  </div>
                  <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest mt-1 font-bold">
                    OFFICIAL SEAL
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                    Academic Lead
                  </span>
                  <span className="text-xs font-mono font-semibold text-neutral-300">
                    {certificate.instructor}
                  </span>
                </div>
              </div>

              {/* Living Companion Reward Callout */}
              <div className="mt-6 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Waves className="w-4 h-4 text-cyan-400" />
                  <span className="text-neutral-400">Unlocked Exotic Companion:</span>
                  <strong className="text-white">{certificate.unlockedFishName}</strong>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">● Tank Resident</span>
              </div>
            </div>

            {/* Cryptographic Verification Hash Bar */}
            <div className="mt-4 p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-neutral-400 truncate">
                <ShieldCheck className="w-4 h-4 text-neutral-300 shrink-0" />
                <span className="text-[11px] text-neutral-500">Hash:</span>
                <span className="text-neutral-200 font-semibold tracking-wider text-[11px] truncate">
                  {certificate.verificationHash}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyHash}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-mono font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Hash'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
