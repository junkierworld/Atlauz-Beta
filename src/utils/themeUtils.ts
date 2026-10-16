/**
 * Theme Utilities - Unified light/dark mode styling
 */

export function getThemeClasses(theme: string | undefined) {
  const isDark = theme === 'dark';
  
  return {
    // Backgrounds
    bg: {
      primary: isDark ? 'bg-neutral-950' : 'bg-neutral-50',
      secondary: isDark ? 'bg-neutral-900' : 'bg-neutral-100',
      tertiary: isDark ? 'bg-neutral-800' : 'bg-neutral-200',
      inverse: isDark ? 'bg-white' : 'bg-black',
      card: isDark ? 'bg-neutral-900' : 'bg-white',
      input: isDark ? 'bg-black' : 'bg-white',
      hover: isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100',
      active: isDark ? 'bg-neutral-700' : 'bg-neutral-300',
    },
    // Text colors
    text: {
      primary: isDark ? 'text-white' : 'text-neutral-900',
      secondary: isDark ? 'text-neutral-300' : 'text-neutral-700',
      tertiary: isDark ? 'text-neutral-500' : 'text-neutral-500',
      inverse: isDark ? 'text-black' : 'text-white',
      muted: isDark ? 'text-neutral-400' : 'text-neutral-600',
    },
    // Borders
    border: {
      primary: isDark ? 'border-neutral-800' : 'border-neutral-200',
      secondary: isDark ? 'border-neutral-700' : 'border-neutral-300',
      light: isDark ? 'border-neutral-900' : 'border-neutral-100',
    },
    // Modals
    modal: {
      backdrop: isDark ? 'bg-black/80' : 'bg-white/80',
      content: isDark ? 'bg-neutral-900' : 'bg-white',
    },
    // Toggles
    toggle: {
      on: isDark ? 'bg-white' : 'bg-neutral-900',
      off: isDark ? 'bg-neutral-600' : 'bg-neutral-300',
      track: isDark ? 'bg-neutral-800' : 'bg-neutral-200',
    },
  };
}

export function getBgClass(theme: string | undefined, type: 'primary' | 'secondary' | 'tertiary' | 'card' | 'input' = 'secondary'): string {
  return getThemeClasses(theme).bg[type];
}

export function getTextClass(theme: string | undefined, type: 'primary' | 'secondary' | 'muted' = 'primary'): string {
  return getThemeClasses(theme).text[type];
}

export function getBorderClass(theme: string | undefined, type: 'primary' | 'secondary' = 'primary'): string {
  return getThemeClasses(theme).border[type];
}
