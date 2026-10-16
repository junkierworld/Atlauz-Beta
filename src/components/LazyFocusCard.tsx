import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FocusCardRenderer } from './FocusCardRenderer';
import { FocusCardItem } from '../types';

/**
 * PHASE 3 OPTIMIZATION: Lazy-load FocusCardRenderer with Intersection Observer
 * Only render visible cards + buffer zone ahead
 * Reduces DOM nodes from 8 always to 2-3 at a time
 */

interface LazyFocusCardProps {
  card: FocusCardItem;
  isVisible: boolean;
  isBuffered: boolean;
  isDominant: boolean;
  onUpdateCard: (id: string, updated: Partial<FocusCardItem>) => void;
  onRemoveCard?: (id: string) => void;
  onChangePurpose: (id: string, newPurpose: any) => void;
  onLaunchFullResource?: (resourceType: string) => void;
  onMinimizeCard?: () => void;
  onShowToast: (msg: string) => void;
  canRemove?: boolean;
}

export const LazyFocusCard: React.FC<LazyFocusCardProps> = ({
  card,
  isVisible,
  isBuffered,
  isDominant,
  onUpdateCard,
  onRemoveCard,
  onChangePurpose,
  onLaunchFullResource,
  onMinimizeCard,
  onShowToast,
  canRemove
}) => {
  const [shouldRender, setShouldRender] = useState(isVisible || isBuffered);
  const ref = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy rendering
  useEffect(() => {
    if (!ref.current) return;

    // Always render visible or buffered cards
    if (isVisible || isBuffered) {
      setShouldRender(true);
      return;
    }

    // For off-screen cards, only render when near viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
        }
      },
      {
        rootMargin: '200px', // Buffer zone: start rendering 200px before visible
        threshold: 0,
        root: null // Default: viewport
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, isBuffered]);

  return (
    <div
      ref={ref}
      className="lazy-focus-card"
      style={{ minHeight: '300px' }} // Prevent layout shift
    >
      {shouldRender ? (
        <FocusCardRenderer
          card={card}
          isDominant={isDominant}
          onUpdateCard={onUpdateCard}
          onRemoveCard={onRemoveCard}
          onChangePurpose={onChangePurpose}
          onLaunchFullResource={onLaunchFullResource}
          onMinimizeCard={onMinimizeCard}
          onShowToast={onShowToast}
          canRemove={canRemove}
        />
      ) : (
        // Skeleton/placeholder while loading
        <div className="animate-pulse bg-neutral-800 rounded-lg h-80" />
      )}
    </div>
  );
};

export default LazyFocusCard;
