/**
 * Haptic Feedback Utility
 * Provides cross-browser haptic feedback for mobile devices
 */

export type HapticIntensity = 'light' | 'medium' | 'heavy';

export function triggerHaptic(intensity: HapticIntensity = 'medium') {
  // Check if Vibration API is available
  const vibrator = (navigator as any).vibrate || (navigator as any).webkitVibrate;
  if (!vibrator) {
    return;
  }

  switch (intensity) {
    case 'light':
      vibrator.call(navigator, [10]);
      break;
    case 'medium':
      vibrator.call(navigator, [30]);
      break;
    case 'heavy':
      vibrator.call(navigator, [50, 10, 50]);
      break;
  }
}

// Convenience functions
export const haptics = {
  light: () => triggerHaptic('light'),
  medium: () => triggerHaptic('medium'),
  heavy: () => triggerHaptic('heavy'),
  success: () => triggerHaptic('medium'),
  error: () => triggerHaptic('heavy'),
  warning: () => {
    const vibrator = (navigator as any).vibrate || (navigator as any).webkitVibrate;
    if (vibrator) {
      vibrator.call(navigator, [30, 20, 30, 20, 30]);
    }
  }
};
