/**
 * Adaptive contrast utility to guarantee high readability across light and dark backgrounds.
 * Calculates relative luminance according to WCAG specifications.
 */

export function parseHexColor(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length !== 6) {
    return { r: 255, g: 255, b: 255 };
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function getLuminance(hex: string): number {
  const { r, g, b } = parseHexColor(hex);
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function isLightBackground(hex: string): boolean {
  if (!hex) return false;
  return getLuminance(hex) > 0.42;
}

export function getAdaptiveTextColor(hex: string): string {
  return isLightBackground(hex) ? '#0a0a0a' : '#ffffff';
}

export function getAdaptiveSubtextColor(hex: string): string {
  return isLightBackground(hex) ? '#404040' : '#a3a3a3';
}

export function getAdaptiveBorderColor(hex: string): string {
  return isLightBackground(hex) ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';
}

export function getAdaptiveBadgeClasses(hex: string): { bg: string; text: string; border: string } {
  const light = isLightBackground(hex);
  return {
    bg: light ? 'bg-neutral-900 text-neutral-100' : 'bg-neutral-100 text-neutral-900',
    text: light ? 'text-black font-semibold' : 'text-white font-semibold',
    border: light ? 'border-neutral-800' : 'border-neutral-200'
  };
}
