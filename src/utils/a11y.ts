/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

/**
 * Focus trap hook - keeps focus within a modal/dialog
 */
export function createFocusTrap(container: HTMLElement | null) {
  if (!container) return;

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus();
        e.preventDefault();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    announcement.remove();
  }, 1000);
}

/**
 * Check if element is visible to screen reader
 */
export function isAccessible(element: HTMLElement): boolean {
  return (
    element.offsetParent !== null && // not display:none
    window.getComputedStyle(element).visibility !== 'hidden' &&
    !element.hasAttribute('aria-hidden')
  );
}

/**
 * Get accessible name for element (used by screen readers)
 */
export function getAccessibleName(element: HTMLElement): string {
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent || '';
  }

  return element.textContent || '';
}

/**
 * CSS for screen reader only content
 */
export const screenReaderOnlyStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;

/**
 * Check color contrast ratio
 */
export function getContrastRatio(
  foreground: string,
  background: string
): number {
  const fgLum = getLuminance(foreground);
  const bgLum = getLuminance(background);
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  return (lighter + 0.05) / (darker + 0.05);
}

function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const [r, g, b] = rgb.map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
}

/**
 * WCAG 2.1 contrast requirements
 */
export function meetsWCAGStandard(contrast: number, level: 'AA' | 'AAA' = 'AA'): boolean {
  const minimumContrast = level === 'AA' ? 4.5 : 7;
  return contrast >= minimumContrast;
}

/**
 * Create keyboard event handler
 */
export function createKeyboardHandler(
  keyMap: Record<string, () => void>
) {
  return (e: KeyboardEvent) => {
    const handler = keyMap[e.key];
    if (handler) {
      e.preventDefault();
      handler();
    }
  };
}
