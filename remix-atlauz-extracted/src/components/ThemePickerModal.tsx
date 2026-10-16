import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, X, Check, Sparkles, Droplets, Sun, Moon, Sparkle } from 'lucide-react';
import { AppThemeId, ATLAUZ_THEMES, ThemeDefinition } from '../themes';
import { ThemeIntensityMode } from '../types';

interface ThemePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppThemeId;
  onSelectTheme: (themeId: AppThemeId) => void;
  intensityMode?: ThemeIntensityMode;
  onToggleIntensityMode?: () => void;
}

export const ThemePickerModal: React.FC<ThemePickerModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  intensityMode = 'focus',
  onToggleIntensityMode
}) => {
  if (!isOpen) return null;

  const conceptualThemes = Object.values(ATLAUZ_THEMES).filter(
    t => t.id !== 'dark' && t.id !== 'light'
  );
  const standardThemes = Object.values(ATLAUZ_THEMES).filter(
    t => t.id === 'dark' || t.id === 'light'
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 font-mono select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-[#0e0e0e] border border-neutral-750 rounded-2xl max-w-2xl w-full max-h-[90dvh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Top Header Bar */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-[#121212]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black border border-neutral-700 text-amber-400 flex items-center justify-center shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                    Atlauz Living Themes & Atmosphere
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-[10px] text-amber-300 font-bold">
                    v1.3.0
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-sans mt-0.5">
                  23 handcrafted conceptual palettes with dual Focus & Fuller intensity modes
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dual Intensity Switcher Control Bar */}
          {onToggleIntensityMode && (
            <div className="p-3 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between gap-3 px-4 shrink-0">
              <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Theme Intensity Mode:</span>
              </div>
              <div className="flex items-center p-1 bg-black/60 rounded-xl border border-neutral-800 gap-1">
                <button
                  onClick={() => intensityMode !== 'focus' && onToggleIntensityMode()}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    intensityMode === 'focus'
                      ? 'bg-neutral-800 text-sky-300 border border-neutral-700 shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Focus Mode (Dark Slate)</span>
                </button>
                <button
                  onClick={() => intensityMode !== 'fuller' && onToggleIntensityMode()}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    intensityMode === 'fuller'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fuller Mode (Solid Colors)</span>
                </button>
              </div>
            </div>
          )}

          {/* Scrollable Theme Grid with Custom Right-Side Scrollbar */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-6 custom-right-scrollbar">
            {/* Conceptual Atmosphere Themes Grouped in ROYGBIV Order */}
            {([
              { name: 'Red & Rose', label: '1. Red & Rose (R)', color: 'text-rose-400' },
              { name: 'Orange & Amber', label: '2. Orange & Amber (O)', color: 'text-amber-500' },
              { name: 'Yellow & Gold', label: '3. Yellow & Gold (Y)', color: 'text-yellow-400' },
              { name: 'Green & Mint', label: '4. Green & Mint (G)', color: 'text-emerald-400' },
              { name: 'Blue & Azure', label: '5. Blue & Azure (B)', color: 'text-sky-400' },
              { name: 'Indigo & Violet', label: '6. Indigo & Violet (I & V)', color: 'text-violet-400' }
            ] as const).map(cat => {
              const catThemes = conceptualThemes.filter(t => t.category === cat.name);
              if (catThemes.length === 0) return null;

              return (
                <div key={cat.name} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                    <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Sparkles className={`w-3.5 h-3.5 ${cat.color}`} />
                      <span>{cat.label}</span>
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {catThemes.length} Theme{catThemes.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {catThemes.map(t => {
                      const isSelected = currentTheme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            onSelectTheme(t.id);
                            onClose();
                          }}
                          style={{
                            background: t.cardGradient || t.colors.bgPrimary,
                            borderColor: isSelected ? t.colors.accent : t.colors.cardBorder
                          }}
                          className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between min-h-[120px] ${
                            isSelected ? 'ring-2 ring-white/60 shadow-lg scale-[1.01]' : 'hover:border-neutral-500'
                          }`}
                        >
                          {/* Unique Theme Backdrop Pattern Preview */}
                          <div
                            className="absolute inset-0 pointer-events-none opacity-20"
                            style={{ background: t.backdropPattern }}
                          />
                          {/* Ambient background soft texture preview */}
                          <div
                            className="absolute inset-0 pointer-events-none opacity-30"
                            style={{ background: t.texturePattern }}
                          />

                          <div className="relative z-10 space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span
                                  style={{ color: t.colors.textPrimary }}
                                  className="text-xs font-bold font-sans block truncate"
                                >
                                  {t.name}
                                </span>
                                <span
                                  style={{
                                    backgroundColor: t.edition === 'Deluxe' ? '#D4AF37' : t.edition === 'Special' ? '#E63946' : t.edition === 'Signature' ? '#0066FF' : 'rgba(255,255,255,0.15)',
                                    color: t.edition === 'Deluxe' || t.edition === 'Special' || t.edition === 'Signature' ? '#000000' : '#ffffff'
                                  }}
                                  className="px-1.5 py-0.2 rounded text-[7px] font-mono font-extrabold uppercase shrink-0"
                                >
                                  {t.edition || (t.id.includes('deluxe') ? 'Deluxe' : t.id.includes('koi') || t.id.includes('sushi') ? 'Special' : 'Classic')}
                                </span>
                              </div>
                              {isSelected && (
                                <span
                                  style={{ backgroundColor: t.colors.accent, color: '#000' }}
                                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                                >
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </span>
                              )}
                            </div>

                            <p
                              style={{ color: t.colors.textSecondary }}
                              className="text-[10px] font-sans line-clamp-1 leading-tight opacity-90"
                            >
                              {t.tagline}
                            </p>

                            {/* Vibe Tags Strip */}
                            <div className="flex items-center gap-1 flex-wrap pt-0.5">
                              <span
                                style={{
                                  backgroundColor: 'rgba(0,0,0,0.3)',
                                  color: t.colors.textSecondary,
                                  borderColor: 'rgba(255,255,255,0.15)'
                                }}
                                className="px-1.5 py-0.5 rounded border text-[8px] font-mono font-semibold truncate max-w-[85px]"
                              >
                                #{t.mood.split(' ')[0]}
                              </span>
                              <span
                                style={{
                                  backgroundColor: 'rgba(255,255,255,0.1)',
                                  color: t.colors.textPrimary
                                }}
                                className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold truncate max-w-[85px]"
                              >
                                #{t.category.split(' ')[0]}
                              </span>
                            </div>
                          </div>

                          {/* Swatches & Mood pill */}
                          <div className="relative z-10 pt-2 flex items-center justify-between border-t border-white/10 mt-2">
                            <div className="flex items-center gap-1.5" title="Primary · Secondary · Neutral Dark · Neutral Light">
                              <div
                                style={{ backgroundColor: t.colors.primary }}
                                className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs"
                                title={`Primary: ${t.colors.primary}`}
                              />
                              <div
                                style={{ backgroundColor: t.colors.secondary }}
                                className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs"
                                title={`Secondary: ${t.colors.secondary}`}
                              />
                              <div
                                style={{ backgroundColor: t.colors.neutralDark }}
                                className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs"
                                title={`Neutral Dark: ${t.colors.neutralDark}`}
                              />
                              <div
                                style={{ backgroundColor: t.colors.neutralLight }}
                                className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs"
                                title={`Neutral Light: ${t.colors.neutralLight}`}
                              />
                            </div>

                            <span
                              style={{
                                backgroundColor: t.colors.badgeBg,
                                color: t.colors.badgeText,
                                borderColor: t.colors.cardBorder
                              }}
                              className="px-1.5 py-0.5 rounded-full border text-[8px] font-bold uppercase truncate max-w-[95px]"
                            >
                              {t.id.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Standard Minimalist Modes */}
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                Standard Minimalist Modes
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {standardThemes.map(t => {
                  const isSelected = currentTheme === t.id;
                  const Icon = t.id === 'light' ? Sun : Moon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTheme(t.id);
                        onClose();
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        t.id === 'light'
                          ? 'bg-neutral-100 text-black border-neutral-300'
                          : 'bg-black text-white border-neutral-800'
                      } ${isSelected ? 'ring-2 ring-amber-400' : 'hover:border-neutral-500'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-neutral-900/10 border border-current/20 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block">{t.name}</span>
                          <span className="text-[10px] opacity-70 block">{t.tagline}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-bold shrink-0">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div className="p-3 sm:p-4 bg-[#121212] border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 shrink-0">
            <span className="text-[11px]">
              Active: <strong className="text-white font-sans">{ATLAUZ_THEMES[currentTheme]?.name || 'Passionate Koi'}</strong>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
