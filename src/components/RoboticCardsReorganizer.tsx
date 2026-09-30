import React from 'react';
import { FocusCardItem } from '../types';
import { FocusCardRenderer } from './FocusCardRenderer';

export type RoboticPhase = 'idle' | 'shrinking' | 'swapping' | 'expanding';

interface CardBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface RoboticCardsReorganizerProps {
  phase: RoboticPhase;
  prevCard: FocusCardItem;
  targetCard: FocusCardItem;
  prevInitial: CardBounds;
  targetInitial: CardBounds;
  isDistractionFree?: boolean;
  isMobileLandscape?: boolean;
  onUpdateCard: (id: string, updated: Partial<FocusCardItem>) => void;
  onRemoveCard: (id: string) => void;
  onChangePurpose: (id: string, newPurpose: any) => void;
  onLaunchFullResource: (type: string) => void;
  onShowToast: (msg: string) => void;
}

export const RoboticCardsReorganizer: React.FC<RoboticCardsReorganizerProps> = ({
  phase,
  prevCard,
  targetCard,
  prevInitial,
  targetInitial,
  isDistractionFree = false,
  isMobileLandscape = false,
  onUpdateCard,
  onRemoveCard,
  onChangePurpose,
  onLaunchFullResource,
  onShowToast
}) => {
  // Phase 1: Shrinking (0 - 400ms):
  //   Card A (prev dominant): shrinks in place to targetInitial dimensions
  //   Card B (chosen): stays at targetInitial
  // Phase 2: Swapping (400 - 1000ms):
  //   Card A: slides from prevInitial position to targetInitial slot
  //   Card B: slides from targetInitial position into prevInitial dominant slot
  // Phase 3: Expanding (1000 - 1500ms, exactly 0.5s):
  //   Card A: docked at targetInitial
  //   Card B: expands from small card size to full dominant size at prevInitial!

  const isShrunkOrSwappingOrDockedA =
    phase === 'shrinking' || phase === 'swapping' || phase === 'expanding';
  const hasArrivedAtTargetA = phase === 'swapping' || phase === 'expanding';

  const currentA = {
    left: hasArrivedAtTargetA ? targetInitial.left : prevInitial.left,
    top: hasArrivedAtTargetA ? targetInitial.top : prevInitial.top,
    width: isShrunkOrSwappingOrDockedA ? targetInitial.width : prevInitial.width,
    height: isShrunkOrSwappingOrDockedA ? targetInitial.height : prevInitial.height
  };

  const hasArrivedAtDominantB = phase === 'swapping' || phase === 'expanding';
  const isExpandedB = phase === 'expanding';

  const currentB = {
    left: hasArrivedAtDominantB ? prevInitial.left : targetInitial.left,
    top: hasArrivedAtDominantB ? prevInitial.top : targetInitial.top,
    width: isExpandedB ? prevInitial.width : targetInitial.width,
    height: isExpandedB ? prevInitial.height : targetInitial.height
  };

  // Precise timing curves:
  // Standard (1.5s total):
  //   Shrinking: 400ms snappy mechanical scale-down
  //   Swapping: 600ms smooth conveyor translation
  //   Expanding: exactly 500ms (0.5s) expansion for the chosen card
  // Landscape (1.0s total, faster by 0.5s):
  //   Shrinking: 250ms rapid mechanical scale-down
  //   Swapping: 400ms quick conveyor translation
  //   Expanding: 350ms expansion for the chosen card
  const getTransitionStyleA = () => {
    if (isMobileLandscape) {
      if (phase === 'shrinking') {
        return 'width 240ms cubic-bezier(0.2, 0.8, 0.2, 1), height 240ms cubic-bezier(0.2, 0.8, 0.2, 1), left 0ms, top 0ms';
      }
      if (phase === 'swapping') {
        return 'left 390ms cubic-bezier(0.25, 1, 0.5, 1), top 390ms cubic-bezier(0.25, 1, 0.5, 1), width 180ms ease, height 180ms ease';
      }
      return 'all 180ms ease';
    }

    if (phase === 'shrinking') {
      return 'width 380ms cubic-bezier(0.2, 0.8, 0.2, 1), height 380ms cubic-bezier(0.2, 0.8, 0.2, 1), left 0ms, top 0ms';
    }
    if (phase === 'swapping') {
      return 'left 580ms cubic-bezier(0.25, 1, 0.5, 1), top 580ms cubic-bezier(0.25, 1, 0.5, 1), width 250ms ease, height 250ms ease';
    }
    return 'all 250ms ease';
  };

  const getTransitionStyleB = () => {
    if (isMobileLandscape) {
      if (phase === 'swapping') {
        return 'left 390ms cubic-bezier(0.25, 1, 0.5, 1), top 390ms cubic-bezier(0.25, 1, 0.5, 1), width 180ms ease, height 180ms ease';
      }
      if (phase === 'expanding') {
        return 'width 350ms cubic-bezier(0.16, 1, 0.3, 1), height 350ms cubic-bezier(0.16, 1, 0.3, 1), left 180ms ease, top 180ms ease';
      }
      return 'all 180ms ease';
    }

    if (phase === 'swapping') {
      return 'left 580ms cubic-bezier(0.25, 1, 0.5, 1), top 580ms cubic-bezier(0.25, 1, 0.5, 1), width 250ms ease, height 250ms ease';
    }
    if (phase === 'expanding') {
      // Exactly 0.5s (500ms) for the chosen card to expand
      return 'width 500ms cubic-bezier(0.16, 1, 0.3, 1), height 500ms cubic-bezier(0.16, 1, 0.3, 1), left 250ms ease, top 250ms ease';
    }
    return 'all 250ms ease';
  };

  // Monochrome prototype styling for robotic cards
  const cardBg = '#0d0d0d';
  const dominantBorder = 'rgba(255, 255, 255, 0.4)';
  const dominantShadow = '0 12px 32px rgba(0, 0, 0, 0.9)';

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden font-sans">
      {/* 1. CARD A (PREVIOUS DOMINANT CARD) */}
      <div
        className="absolute z-30 transition-all rounded border shadow-2xl flex flex-col overflow-hidden transform-gpu"
        style={{
          left: currentA.left,
          top: currentA.top,
          width: currentA.width,
          height: currentA.height,
          transition: getTransitionStyleA(),
          backgroundColor: cardBg,
          borderColor: isShrunkOrSwappingOrDockedA
            ? 'rgba(255,255,255,0.15)'
            : dominantBorder,
          boxShadow: isShrunkOrSwappingOrDockedA
            ? '0 6px 20px rgba(0,0,0,0.6)'
            : dominantShadow
        }}
      >
        {/* Subtle accent bar matching card color */}
        <div
          className="h-1 w-full shrink-0 opacity-80"
          style={{ backgroundColor: prevCard.color || '#ffffff' }}
        />

        {/* Real Card Content - Original labels preserved unchanged */}
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <FocusCardRenderer
            card={prevCard}
            isDominant={!isShrunkOrSwappingOrDockedA}
            isMobileLandscape={isMobileLandscape}
            showIconOnly={isShrunkOrSwappingOrDockedA}
            onUpdateCard={onUpdateCard}
            onRemoveCard={onRemoveCard}
            onChangePurpose={onChangePurpose}
            onLaunchFullResource={onLaunchFullResource}
            onShowToast={onShowToast}
            canRemove={false}
          />
        </div>
      </div>

      {/* 2. CARD B (CHOSEN CARD MOVING AND THEN EXPANDING FOR 0.5s) */}
      <div
        className="absolute z-40 transition-all rounded border shadow-2xl flex flex-col overflow-hidden transform-gpu"
        style={{
          left: currentB.left,
          top: currentB.top,
          width: currentB.width,
          height: currentB.height,
          transition: getTransitionStyleB(),
          backgroundColor: cardBg,
          borderColor: isExpandedB
            ? dominantBorder
            : 'rgba(255,255,255,0.15)',
          boxShadow: isExpandedB
            ? dominantShadow
            : '0 6px 20px rgba(0,0,0,0.6)'
        }}
      >
        {/* Subtle accent bar matching card color */}
        <div
          className="h-1 w-full shrink-0 opacity-80"
          style={{ backgroundColor: targetCard.color || '#ffffff' }}
        />

        {/* Real Card Content - Original labels preserved unchanged */}
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <FocusCardRenderer
            card={targetCard}
            isDominant={isExpandedB}
            isMobileLandscape={isMobileLandscape}
            showIconOnly={!isExpandedB}
            onUpdateCard={onUpdateCard}
            onRemoveCard={onRemoveCard}
            onChangePurpose={onChangePurpose}
            onLaunchFullResource={onLaunchFullResource}
            onShowToast={onShowToast}
            canRemove={false}
          />
        </div>
      </div>
    </div>
  );
};
