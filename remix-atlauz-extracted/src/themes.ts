export type AppThemeId =
  | 'passionate_koi'
  | 'salmon_pink'
  | 'tropical_bombshell'
  | 'silly_clownfish'
  | 'king_crabby'
  | 'sunshine_sushi'
  | 'midnight_sun'
  | 'angler_cave'
  | 'sunken_ship'
  | 'fancy_caviar'
  | 'summer_breeze'
  | 'algal_bloom'
  | 'slow_seafoam'
  | 'atlauz_blue'
  | 'atlauz_deluxe'
  | 'wishful_milkfish'
  | 'arctic_atlauz'
  | 'techno_tuna'
  | 'chrome_swordfish'
  | 'moonlight_delight'
  | 'coral_reef'
  | 'deep_dark'
  | 'mellow_moon'
  | 'dark'
  | 'light';

export interface ThemeColors {
  primary: string;
  secondary: string;
  neutralDark: string;
  neutralLight: string;
  bgPrimary: string;
  bgSecondary: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentGlow: string;
  highlight: string;
  badgeBg: string;
  badgeText: string;
  tankTop: string;
  tankBottom: string;
}

export interface ThemeDefinition {
  id: AppThemeId;
  name: string;
  tagline: string;
  description: string;
  mood: string;
  category: 'Red & Rose' | 'Orange & Amber' | 'Yellow & Gold' | 'Green & Mint' | 'Blue & Azure' | 'Indigo & Violet' | 'Standard';
  colors: ThemeColors;
  headerBg: string;
  headerText: string;
  heroGradient: string;
  actionBtnBg: string;
  actionBtnText: string;
  cardHeaderBg: string;
  cardSurface: string;
  cardGradient: string;
  backdropPattern: string;
  texturePattern: string;
  swatches: string[];
  edition?: 'Deluxe' | 'Special' | 'Classic' | 'Signature' | 'Standard';
  vibeTags?: string[];
}

export const ATLAUZ_THEMES: Record<AppThemeId, ThemeDefinition> = {
  // ==================== RED & ROSE (ROYGBIV: R) ====================
  passionate_koi: {
    id: 'passionate_koi',
    name: 'Passionate Koi',
    tagline: 'Deep Vermilion & Warm Koi Orange',
    description: 'Refined deep vermilion and koi orange accents set over dark charcoal surfaces for determined focus.',
    mood: 'High Energy & Refined Focus',
    category: 'Red & Rose',
    colors: {
      primary: '#E63946',
      secondary: '#F4A261',
      neutralDark: '#1D1618',
      neutralLight: '#FDF8F5',
      bgPrimary: '#1D1618',
      bgSecondary: '#2B1E21',
      cardBg: '#251A1D',
      cardBorder: '#E63946',
      textPrimary: '#FDF8F5',
      textSecondary: '#F4A261',
      textMuted: '#B89B9C',
      accent: '#E63946',
      accentGlow: 'rgba(230, 57, 70, 0.45)',
      highlight: '#F4A261',
      badgeBg: '#381E21',
      badgeText: '#FDF8F5',
      tankTop: '#2B181A',
      tankBottom: '#120D0E'
    },
    headerBg: '#1D1618',
    headerText: '#FDF8F5',
    heroGradient: 'linear-gradient(135deg, #2B181A 0%, #381E21 100%)',
    actionBtnBg: '#E63946',
    actionBtnText: '#FFFFFF',
    cardHeaderBg: '#2B1E21',
    cardSurface: '#251A1D',
    cardGradient: 'linear-gradient(135deg, rgba(37, 26, 29, 0.95) 0%, rgba(56, 30, 33, 0.95) 100%)',
    backdropPattern: 'radial-gradient(circle at 20px 20px, rgba(230, 57, 70, 0.15) 2px, transparent 3px), radial-gradient(circle at 40px 40px, rgba(244, 162, 97, 0.12) 2px, transparent 3px)',
    texturePattern: 'radial-gradient(ellipse at top right, rgba(230, 57, 70, 0.25), transparent 60%), radial-gradient(ellipse at bottom left, rgba(244, 162, 97, 0.18), transparent 60%)',
    swatches: ['#E63946', '#F4A261', '#1D1618', '#FDF8F5']
  },

  salmon_pink: {
    id: 'salmon_pink',
    name: 'Salmon Pink',
    tagline: 'Warm Rose Peach & Soft Blush Radiance',
    description: 'Calm rose peach tones and soft blush accents over plum espresso canvas for cognitive ease.',
    mood: 'Calm Synthesis & Cognitive Ease',
    category: 'Red & Rose',
    colors: {
      primary: '#E07A5F',
      secondary: '#F4ACB7',
      neutralDark: '#1C1518',
      neutralLight: '#FFF7F7',
      bgPrimary: '#1C1518',
      bgSecondary: '#281E22',
      cardBg: '#22191D',
      cardBorder: '#E07A5F',
      textPrimary: '#FFF7F7',
      textSecondary: '#F4ACB7',
      textMuted: '#B2979C',
      accent: '#E07A5F',
      accentGlow: 'rgba(224, 122, 95, 0.45)',
      highlight: '#F4ACB7',
      badgeBg: '#3D262B',
      badgeText: '#FFF7F7',
      tankTop: '#2A1C20',
      tankBottom: '#100C0E'
    },
    headerBg: '#1C1518',
    headerText: '#FFF7F7',
    heroGradient: 'linear-gradient(135deg, #2A1C20 0%, #3D262B 100%)',
    actionBtnBg: '#E07A5F',
    actionBtnText: '#FFFFFF',
    cardHeaderBg: '#281E22',
    cardSurface: '#22191D',
    cardGradient: 'linear-gradient(135deg, rgba(34, 25, 29, 0.95) 0%, rgba(61, 38, 43, 0.95) 100%)',
    backdropPattern: 'repeating-linear-gradient(0deg, rgba(244, 172, 183, 0.06), rgba(244, 172, 183, 0.06) 1.5px, transparent 1.5px, transparent 14px)',
    texturePattern: 'radial-gradient(circle at 20% 20%, rgba(224, 122, 95, 0.25), transparent 50%), radial-gradient(circle at 80% 80%, rgba(244, 172, 183, 0.18), transparent 50%)',
    swatches: ['#E07A5F', '#F4ACB7', '#1C1518', '#FFF7F7']
  },

  tropical_bombshell: {
    id: 'tropical_bombshell',
    name: 'Tropical Bombshell',
    tagline: 'Deep Hibiscus & Palm Sage',
    description: 'Sophisticated deep hibiscus accent with muted palm sage set on velvet tropical night surfaces.',
    mood: 'Refined Tropical Elegance',
    category: 'Red & Rose',
    colors: {
      primary: '#D81B60',
      secondary: '#2E7D32',
      neutralDark: '#160B18',
      neutralLight: '#FDF5F8',
      bgPrimary: '#160B18',
      bgSecondary: '#241128',
      cardBg: '#1C0D21',
      cardBorder: '#D81B60',
      textPrimary: '#FDF5F8',
      textSecondary: '#81C784',
      textMuted: '#9C7A9E',
      accent: '#D81B60',
      accentGlow: 'rgba(216, 27, 96, 0.45)',
      highlight: '#81C784',
      badgeBg: '#38183B',
      badgeText: '#FDF5F8',
      tankTop: '#241128',
      tankBottom: '#0D050E'
    },
    headerBg: '#160B18',
    headerText: '#FDF5F8',
    heroGradient: 'linear-gradient(135deg, #241128 0%, #38183B 100%)',
    actionBtnBg: '#D81B60',
    actionBtnText: '#FFFFFF',
    cardHeaderBg: '#241128',
    cardSurface: '#1C0D21',
    cardGradient: 'linear-gradient(135deg, rgba(28, 13, 33, 0.95) 0%, rgba(56, 24, 59, 0.95) 100%)',
    backdropPattern: 'radial-gradient(circle at 15px 15px, rgba(216, 27, 96, 0.15) 2px, transparent 3px)',
    texturePattern: 'radial-gradient(circle at 20% 20%, rgba(216, 27, 96, 0.25), transparent 50%), radial-gradient(circle at 80% 80%, rgba(46, 125, 50, 0.18), transparent 50%)',
    swatches: ['#D81B60', '#2E7D32', '#160B18', '#FDF5F8']
  },

  silly_clownfish: {
    id: 'silly_clownfish',
    name: 'Silly Clownfish',
    tagline: 'Warm Anemone Coral & Soft Cream',
    description: 'Warm anemone coral primary controls with clownfish gold highlights over deep reef dark surfaces.',
    mood: 'Playful Aquatic Radiance',
    category: 'Red & Rose',
    colors: {
      primary: '#E05638',
      secondary: '#F39C12',
      neutralDark: '#1C1311',
      neutralLight: '#FFF5F2',
      bgPrimary: '#1C1311',
      bgSecondary: '#2B1C18',
      cardBg: '#241613',
      cardBorder: '#E05638',
      textPrimary: '#FFF5F2',
      textSecondary: '#F39C12',
      textMuted: '#B3918B',
      accent: '#E05638',
      accentGlow: 'rgba(224, 86, 56, 0.45)',
      highlight: '#F39C12',
      badgeBg: '#3E221C',
      badgeText: '#FFF5F2',
      tankTop: '#2B1C18',
      tankBottom: '#100B09'
    },
    headerBg: '#1C1311',
    headerText: '#FFF5F2',
    heroGradient: 'linear-gradient(135deg, #2B1C18 0%, #3E221C 100%)',
    actionBtnBg: '#E05638',
    actionBtnText: '#FFFFFF',
    cardHeaderBg: '#2B1C18',
    cardSurface: '#241613',
    cardGradient: 'linear-gradient(135deg, rgba(36, 22, 19, 0.95) 0%, rgba(62, 34, 28, 0.95) 100%)',
    backdropPattern: 'radial-gradient(circle at 18px 18px, rgba(224, 86, 56, 0.15) 2.5px, transparent 3.5px)',
    texturePattern: 'radial-gradient(circle at 15% 15%, rgba(224, 86, 56, 0.25), transparent 50%), radial-gradient(circle at 85% 85%, rgba(243, 156, 18, 0.18), transparent 50%)',
    swatches: ['#E05638', '#F39C12', '#1C1311', '#FFF5F2']
  },

  king_crabby: {
    id: 'king_crabby',
    name: 'King Crabby',
    tagline: 'Emperor Crimson & Shell Gold',
    description: 'Royal emperor crimson controls with deep shell gold highlights over dark crimson ocean trench.',
    mood: 'Majestic Royal Focus',
    category: 'Red & Rose',
    colors: {
      primary: '#C0392B',
      secondary: '#F1C40F',
      neutralDark: '#1A0E0D',
      neutralLight: '#FFF6F5',
      bgPrimary: '#1A0E0D',
      bgSecondary: '#291614',
      cardBg: '#221110',
      cardBorder: '#C0392B',
      textPrimary: '#FFF6F5',
      textSecondary: '#F1C40F',
      textMuted: '#AD8987',
      accent: '#C0392B',
      accentGlow: 'rgba(192, 57, 43, 0.45)',
      highlight: '#F1C40F',
      badgeBg: '#3C1C19',
      badgeText: '#FFF6F5',
      tankTop: '#291614',
      tankBottom: '#0E0807'
    },
    headerBg: '#1A0E0D',
    headerText: '#FFF6F5',
    heroGradient: 'linear-gradient(135deg, #291614 0%, #3C1C19 100%)',
    actionBtnBg: '#C0392B',
    actionBtnText: '#FFFFFF',
    cardHeaderBg: '#291614',
    cardSurface: '#221110',
    cardGradient: 'linear-gradient(135deg, rgba(34, 17, 16, 0.95) 0%, rgba(60, 28, 25, 0.95) 100%)',
    backdropPattern: 'repeating-linear-gradient(45deg, rgba(192, 57, 43, 0.06), rgba(192, 57, 43, 0.06) 1.5px, transparent 1.5px, transparent 12px)',
    texturePattern: 'radial-gradient(circle at 80% 20%, rgba(192, 57, 43, 0.25), transparent 50%), radial-gradient(circle at 20% 80%, rgba(241, 196, 15, 0.18), transparent 50%)',
    swatches: ['#C0392B', '#F1C40F', '#1A0E0D', '#FFF6F5']
  },

  // ==================== ORANGE & AMBER (ROYGBIV: O) ====================
  sunshine_sushi: {
    id: 'sunshine_sushi',
    name: 'Sunshine Sushi',
    tagline: 'Sunlit Warm Coral & Nori Gold',
    description: 'Warm salmon coral and nori amber gold over deep toasted rice dark canvas for inviting clarity.',
    mood: 'Warm Culinary Harmony',
    category: 'Orange & Amber',
    colors: {
      primary: '#D97706',
      secondary: '#EAB308',
      neutralDark: '#1B1612',
      neutralLight: '#FFFBF5',
      bgPrimary: '#1B1612',
      bgSecondary: '#29211B',
      cardBg: '#221B16',
      cardBorder: '#D97706',
      textPrimary: '#FFFBF5',
      textSecondary: '#EAB308',
      textMuted: '#A68D81',
      accent: '#D97706',
      accentGlow: 'rgba(217, 119, 6, 0.45)',
      highlight: '#EAB308',
      badgeBg: '#3A2A20',
      badgeText: '#FFFBF5',
      tankTop: '#2A201A',
      tankBottom: '#100D0A'
    },
    headerBg: '#1B1612',
    headerText: '#FFFBF5',
    heroGradient: 'linear-gradient(135deg, #2A201A 0%, #3A2A20 100%)',
    actionBtnBg: '#D97706',
    actionBtnText: '#FFFFFF',
    cardHeaderBg: '#29211B',
    cardSurface: '#221B16',
    cardGradient: 'linear-gradient(135deg, rgba(34, 27, 22, 0.95) 0%, rgba(58, 42, 32, 0.95) 100%)',
    backdropPattern: 'repeating-linear-gradient(0deg, rgba(217, 119, 6, 0.06), rgba(217, 119, 6, 0.06) 1.5px, transparent 1.5px, transparent 14px)',
    texturePattern: 'radial-gradient(circle at 80% 10%, rgba(217, 119, 6, 0.22), transparent 50%), radial-gradient(circle at 10% 90%, rgba(234, 179, 8, 0.18), transparent 50%)',
    swatches: ['#D97706', '#EAB308', '#1B1612', '#FFFBF5']
  },

  midnight_sun: {
    id: 'midnight_sun',
    name: 'Midnight Sun',
    tagline: 'Solar Amber & Eclipse Violet',
    description: 'Golden solar amber glowing against deep eclipse purple and midnight abyss background.',
    mood: 'Nocturnal Solar Fusion',
    category: 'Orange & Amber',
    colors: {
      primary: '#F59E0B',
      secondary: '#8B5CF6',
      neutralDark: '#140E20',
      neutralLight: '#FFFDF5',
      bgPrimary: '#140E20',
      bgSecondary: '#211533',
      cardBg: '#1A1129',
      cardBorder: '#F59E0B',
      textPrimary: '#FFFDF5',
      textSecondary: '#F59E0B',
      textMuted: '#9B88B2',
      accent: '#F59E0B',
      accentGlow: 'rgba(245, 158, 11, 0.45)',
      highlight: '#8B5CF6',
      badgeBg: '#2E1B48',
      badgeText: '#FFFDF5',
      tankTop: '#211533',
      tankBottom: '#0A0710'
    },
    headerBg: '#140E20',
    headerText: '#FFFDF5',
    heroGradient: 'linear-gradient(135deg, #211533 0%, #2E1B48 100%)',
    actionBtnBg: '#F59E0B',
    actionBtnText: '#140E20',
    cardHeaderBg: '#211533',
    cardSurface: '#1A1129',
    cardGradient: 'linear-gradient(135deg, rgba(26, 17, 41, 0.95) 0%, rgba(46, 27, 72, 0.95) 100%)',
    backdropPattern: 'radial-gradient(circle at 20px 20px, rgba(245, 158, 11, 0.15) 2px, transparent 3px)',
    texturePattern: 'radial-gradient(circle at 70% 20%, rgba(245, 158, 11, 0.25), transparent 55%), radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.2), transparent 55%)',
    swatches: ['#F59E0B', '#8B5CF6', '#140E20', '#FFFDF5']
  },

  angler_cave: {
    id: 'angler_cave',
    name: 'Angler Cave',
    tagline: 'Lantern Gold & Abyssal Cavern',
    description: 'Bioluminescent lantern gold glowing softly in deep abyssal cavern dark.',
    mood: 'Deep Cavern Discovery',
    category: 'Orange & Amber',
    colors: {
      primary: '#F39C12',
      secondary: '#E67E22',
      neutralDark: '#140F09',
      neutralLight: '#FFFDF5',
      bgPrimary: '#140F09',
      bgSecondary: '#21180E',
      cardBg: '#1A130B',
      cardBorder: '#F39C12',
      textPrimary: '#FFFDF5',
      textSecondary: '#F39C12',
      textMuted: '#9E8873',
      accent: '#F39C12',
      accentGlow: 'rgba(243, 156, 18, 0.45)',
      highlight: '#E67E22',
      badgeBg: '#332311',
      badgeText: '#FFFDF5',
      tankTop: '#21180E',
      tankBottom: '#0A0704'
    },
    headerBg: '#140F09',
    headerText: '#FFFDF5',
    heroGradient: 'linear-gradient(135deg, #21180E 0%, #332311 100%)',
    actionBtnBg: '#F39C12',
    actionBtnText: '#140F09',
    cardHeaderBg: '#21180E',
    cardSurface: '#1A130B',
    cardGradient: 'linear-gradient(135deg, rgba(26, 19, 11, 0.95) 0%, rgba(51, 35, 17, 0.95) 100%)',
    backdropPattern: 'radial-gradient(circle at 25px 25px, rgba(243, 156, 18, 0.18) 2px, transparent 3px)',
    texturePattern: 'radial-gradient(ellipse at 50% 10%, rgba(243, 156, 18, 0.25), transparent 60%), radial-gradient(ellipse at 50% 90%, rgba(230, 126, 34, 0.18), transparent 60%)',
    swatches: ['#F39C12', '#E67E22', '#140F09', '#FFFDF5']
  },

  sunken_ship: {
    id: 'sunken_ship',
    name: 'Sunken Ship',
    tagline: 'Nautical Bronze & Timber Dark',
    description: 'Rustic nautical bronze accents over deep abyssal timber dark canvas for atmospheric mystery.',
    mood: 'Historic Ocean Exploration',
    category: 'Orange & Amber',
    colors: {
      primary: '#D35400',
      secondary: '#8D6E63',
      neutralDark: '#17110D',
      neutralLight: '#FAF4F0',
      bgPrimary: '#17110D',
      bgSecondary: '#241A14',
      cardBg: '#1E1510',
      cardBorder: '#D35400',
      textPrimary: '#FAF4F0',
      textSecondary: '#D35400',
      textMuted: '#99847A',
      accent: '#D35400',
      accentGlow: 'rgba(211, 84, 0, 0.45)',
      highlight: '#8D6E63',
      badgeBg: '#36241C',
      badgeText: '#FAF4F0',
      tankTop: '#241A14',
      tankBottom: '#0D0A08'
    },
    headerBg: '#17110D',
    headerText: '#FAF4F0',
    heroGradient: 'linear-gradient(135deg, #241A14 0%, #36241C 100%)',
    actionBtnBg: '#D35400',
    actionBtnText: '#FFFFFF',
    cardHeaderBg: '#241A14',
    cardSurface: '#1E1510',
    cardGradient: 'linear-gradient(135deg, rgba(30, 21, 16, 0.95) 0%, rgba(54, 36, 28, 0.95) 100%)',
    backdropPattern: 'repeating-linear-gradient(0deg, rgba(211, 84, 0, 0.06), rgba(211, 84, 0, 0.06) 1.5px, transparent 1.5px, transparent 12px)',
    texturePattern: 'radial-gradient(circle at 10% 20%, rgba(211, 84, 0, 0.22), transparent 50%), radial-gradient(circle at 90% 80%, rgba(141, 110, 99, 0.18), transparent 50%)',
    swatches: ['#D35400', '#8D6E63', '#17110D', '#FAF4F0']
  },

  // ==================== YELLOW & GOLD (ROYGBIV: Y) ====================
  fancy_caviar: {
    id: 'fancy_caviar',
    name: 'Fancy Caviar',
    tagline: 'Muted Champagne Gold & Smoked Obsidian',
    description: 'Ultra-luxe sturgeon black canvas drenched in muted champagne gold accents and smoked obsidian cards.',
    mood: 'Refined Luxury & Sleek Dark Elegance',
    category: 'Yellow & Gold',
    colors: {
      primary: '#D4AF37',
      secondary: '#997A15',
      neutralDark: '#121212',
      neutralLight: '#F4F4F6',
      bgPrimary: '#121212',
      bgSecondary: '#1C1A14',
      cardBg: '#171612',
      cardBorder: '#D4AF37',
      textPrimary: '#F4F4F6',
      textSecondary: '#D4AF37',
      textMuted: '#8E8E93',
      accent: '#D4AF37',
      accentGlow: 'rgba(212, 175, 55, 0.45)',
      highlight: '#F4F4F6',
      badgeBg: '#29261D',
      badgeText: '#F4F4F6',
      tankTop: '#1C1A14',
      tankBottom: '#0A0A0A'
    },
    headerBg: '#121212',
    headerText: '#F4F4F6',
    heroGradient: 'linear-gradient(135deg, #1C1A14 0%, #29261D 100%)',
    actionBtnBg: '#D4AF37',
    actionBtnText: '#121212',
    cardHeaderBg: '#1C1A14',
    cardSurface: '#171612',
    cardGradient: 'linear-gradient(135deg, rgba(23, 22, 18, 0.95) 0%, rgba(41, 38, 29, 0.95) 100%)',
    backdropPattern: 'radial-gradient(circle at 16px 16px, rgba(212, 175, 55, 0.15) 2.5px, transparent 3.5px)',
    texturePattern: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.2), transparent 60%), radial-gradient(circle at 100% 0%, rgba(244, 244, 246, 0.1), transparent 40%)',
    swatches: ['#D4AF37', '#997A15', '#121212', '#F4F4F6']
  },

  // ==================== GREEN & MINT (ROYGBIV: G) ====================
  summer_breeze: {
    id: 'summer_breeze',
    name: 'Summer Breeze',
    tagline: 'Refreshing Mint Teal & Sunlit Soft Amber',
    description: 'Refreshing mint teal triggers paired with sunlit amber badges over deep navy gray for mental clarity.',
    mood: 'Mental Clarity & Refreshing Pacing',
    category: 'Green & Mint',
    colors: {
      primary: '#0D9488',
      secondary: '#F59E0B',
      neutralDark: '#0F1E1B',
      neutralLight: '#F2FBF9',
      bgPrimary: '#0F1E1B',
      bgSecondary: '#142E2A',
      cardBg: '#112522',
      cardBorder: '#0D9488',
      textPrimary: '#F2FBF9',
      textSecondary: '#F59E0B',
      textMuted: '#7AA39B',
      accent: '#0D9488',
      accentGlow: 'rgba(13, 148, 136, 0.45)',
      highlight: '#F59E0B',
      badgeBg: '#1A3E39',
      badgeText: '#F2FBF9',
      tankTop: '#142E2A',
      tankBottom: '#081311'
    },
    headerBg: '#0F1E1B',
    headerText: '#F2FBF9',
    heroGradient: 'linear-gradient(135deg, #142E2A 0%, #1A3E39 100%)',
    actionBtnBg: '#0D9488',
    actionBtnText: '#FFFFFF',
    cardHeaderBg: '#142E2A',
    cardSurface: '#112522',
    cardGradient: 'linear-gradient(135deg, rgba(17, 37, 34, 0.95) 0%, rgba(26, 62, 57, 0.95) 100%)',
    backdropPattern: 'repeating-linear-gradient(45deg, rgba(13, 148, 136, 0.06), rgba(13, 148, 136, 0.06) 1.5px, transparent 1.5px, transparent 12px)',
    texturePattern: 'radial-gradient(circle at 10% 30%, rgba(13, 148, 136, 0.25), transparent 50%), radial-gradient(circle at 90% 70%, rgba(245, 158, 11, 0.18), transparent 50%)',
    swatches: ['#0D9488', '#F59E0B', '#0F1E1B', '#F2FBF9']
  },

  algal_bloom: {
    id: 'algal_bloom',
    name: 'Algal Bloom',
    tagline: 'Lush Bio Emerald & Trench Moss',
    description: 'Lush bio-emerald primary accents with trench moss fills for deep organic focus.',
    mood: 'Organic Bio-Luminescent Flow',
    category: 'Green & Mint',
    colors: {
      primary: '#10B981',
      secondary: '#34D399',
      neutralDark: '#0D2218',
      neutralLight: '#F0FDF4',
      bgPrimary: '#0D2218',
      bgSecondary: '#133322',
      cardBg: '#102A1D',
      cardBorder: '#10B981',
      textPrimary: '#F0FDF4',
      textSecondary: '#34D399',
      textMuted: '#71A88A',
      accent: '#10B981',
      accentGlow: 'rgba(16, 185, 129, 0.45)',
      highlight: '#34D399',
      badgeBg: '#1B472E',
      badgeText: '#F0FDF4',
      tankTop: '#133322',
      tankBottom: '#07160D'
    },
    headerBg: '#0D2218',
    headerText: '#F0FDF4',
    heroGradient: 'linear-gradient(135deg, #133322 0%, #1B472E 100%)',
    actionBtnBg: '#10B981',
    actionBtnText: '#0D2218',
    cardHeaderBg: '#133322',
    cardSurface: '#102A1D',
    cardGradient: 'linear-gradient(135deg, rgba(16, 42, 29, 0.95) 0%, rgba(27, 71, 46, 0.95) 100%)',
    backdropPattern: 'radial-gradient(circle at 15px 15px, rgba(16, 185, 129, 0.15) 2px, transparent 3px)',
    texturePattern: 'radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.25), transparent 50%), radial-gradient(circle at 20% 80%, rgba(52, 211, 153, 0.18), transparent 50%)',
    swatches: ['#10B981', '#34D399', '#0D2218', '#F0FDF4']
  },

  slow_seafoam: {
    id: 'slow_seafoam',
    name: 'Slow Seafoam',
    tagline: 'Calm Seafoam Mint & Aquatic Sage',
    description: 'Calm seafoam mint and aquatic sage for tranquil, peaceful learning flow.',
    mood: 'Tranquil Seafoam Pacing',
    category: 'Green & Mint',
    colors: {
      primary: '#14B8A6',
      secondary: '#2DD4BF',
      neutralDark: '#0D1F1C',
      neutralLight: '#F0FDFA',
      bgPrimary: '#0D1F1C',
      bgSecondary: '#132F2B',
      cardBg: '#102724',
      cardBorder: '#14B8A6',
      textPrimary: '#F0FDFA',
      textSecondary: '#2DD4BF',
      textMuted: '#73A6A0',
      accent: '#14B8A6',
      accentGlow: 'rgba(20, 184, 166, 0.45)',
      highlight: '#2DD4BF',
      badgeBg: '#1A423B',
      badgeText: '#F0FDFA',
      tankTop: '#132F2B',
      tankBottom: '#071412'
    },
    headerBg: '#0D1F1C',
    headerText: '#F0FDFA',
    heroGradient: 'linear-gradient(135deg, #132F2B 0%, #1A423B 100%)',
    actionBtnBg: '#14B8A6',
    actionBtnText: '#0D1F1C',
    cardHeaderBg: '#132F2B',
    cardSurface: '#102724',
    cardGradient: 'linear-gradient(135deg, rgba(16, 39, 36, 0.95) 0%, rgba(26, 66, 59, 0.95) 100%)',
    backdropPattern: 'repeating-linear-gradient(0deg, rgba(20, 184, 166, 0.06), rgba(20, 184, 166, 0.06) 1.5px, transparent 1.5px, transparent 14px)',
    texturePattern: 'radial-gradient(circle at 10% 20%, rgba(20, 184, 166, 0.25), transparent 50%), radial-gradient(circle at 90% 80%, rgba(45, 212, 191, 0.18), transparent 50%)',
    swatches: ['#14B8A6', '#2DD4BF', '#0D1F1C', '#F0FDFA']
  },

  // ==================== BLUE & AZURE (ROYGBIV: B) ====================
  atlauz_blue: {
    id: 'atlauz_blue',
    name: 'Atlauz Blue',
    tagline: 'Deep Azure & Sky Blue Focus',
    description: 'Electric azure blue highlights with medium sky indicators over midnight slate ocean depth.',
    mood: 'Laser Hyper-Focus & Academic Depth',
    category: 'Blue & Azure',
    colors: {
      primary: '#0284C7',
      secondary: '#38BDF8',
      neutralDark: '#0B1626',
      neutralLight: '#F0F7FF',
      bgPrimary: '#0B1626',
      bgSecondary: '#10243C',
      cardBg: '#0E1D33',
      cardBorder: '#0284C7',
      textPrimary: '#F0F7FF',
      textSecondary: '#38BDF8',
      textMuted: '#7895B2',
      accent: '#0284C7',
      accentGlow: 'rgba(2, 132, 199, 0.45)',
      highlight: '#38BDF8',
      badgeBg: '#183556',
      badgeText: '#F0F7FF',
      tankTop: '#10243C',
      tankBottom: '#050D17'
    },
    headerBg: '#0B1626',
    headerText: '#F0F7FF',
    heroGradient: 'linear-gradient(135deg, #10243C 0%, #183556 100%)',
    actionBtnBg: '#0284C7',
    actionBtnText: '#FFFFFF',
    cardHeaderBg: '#10243C',
    cardSurface: '#0E1D33',
    cardGradient: 'linear-gradient(135deg, rgba(14, 29, 51, 0.95) 0%, rgba(24, 53, 86, 0.95) 100%)',
    backdropPattern: 'linear-gradient(to right, rgba(2, 132, 199, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 132, 199, 0.08) 1px, transparent 1px)',
    texturePattern: 'radial-gradient(ellipse at 50% 0%, rgba(2, 132, 199, 0.25), transparent 70%), radial-gradient(ellipse at 50% 100%, rgba(56, 189, 248, 0.18), transparent 70%)',
    swatches: ['#0284C7', '#38BDF8', '#0B1626', '#F0F7FF']
  },

  atlauz_deluxe: {
    id: 'atlauz_deluxe',
    name: 'Atlauz Deluxe',
    tagline: 'Deep Royal Atlauz & Cyan Glow',
    description: 'Authoritative royal Atlauz blue controls with cyan glow sliders over deep space navy.',
    mood: 'Academic Distinction & Mastery',
    category: 'Blue & Azure',
    colors: {
      primary: '#1D4ED8',
      secondary: '#0EA5E9',
      neutralDark: '#080E1C',
      neutralLight: '#F1F5F9',
      bgPrimary: '#080E1C',
      bgSecondary: '#0F1E36',
      cardBg: '#0B182B',
      cardBorder: '#1D4ED8',
      textPrimary: '#F1F5F9',
      textSecondary: '#0EA5E9',
      textMuted: '#7288A5',
      accent: '#1D4ED8',
      accentGlow: 'rgba(29, 78, 216, 0.45)',
      highlight: '#0EA5E9',
      badgeBg: '#182C52',
      badgeText: '#F1F5F9',
      tankTop: '#0F1E36',
      tankBottom: '#04070F'
    },
    headerBg: '#080E1C',
    headerText: '#F1F5F9',
    heroGradient: 'linear-gradient(135deg, #0F1E36 0%, #182C52 100%)',
    actionBtnBg: '#1D4ED8',
    actionBtnText: '#FFFFFF',
    cardHeaderBg: '#0F1E36',
    cardSurface: '#0B182B',
    cardGradient: 'linear-gradient(135deg, rgba(11, 24, 43, 0.95) 0%, rgba(24, 44, 82, 0.95) 100%)',
    backdropPattern: 'repeating-linear-gradient(0deg, rgba(14, 165, 233, 0.05), rgba(14, 165, 233, 0.05) 1px, transparent 1px, transparent 8px)',
    texturePattern: 'radial-gradient(ellipse at top left, rgba(29, 78, 216, 0.25), transparent 55%), radial-gradient(ellipse at bottom right, rgba(14, 165, 233, 0.18), transparent 55%)',
    swatches: ['#1D4ED8', '#0EA5E9', '#080E1C', '#F1F5F9']
  },

  wishful_milkfish: {
    id: 'wishful_milkfish',
    name: 'Wishful Milkfish',
    tagline: 'Silvery Scale Gray & Ocean Mist',
    description: 'Clean silvery scale gray navigation with ocean blue interactive feedback on abyssal dark slate.',
    mood: 'Pristine Focus & Aquatic Heritage',
    category: 'Blue & Azure',
    colors: {
      primary: '#64748B',
      secondary: '#0284C7',
      neutralDark: '#0F172A',
      neutralLight: '#FAFAFA',
      bgPrimary: '#0F172A',
      bgSecondary: '#182238',
      cardBg: '#131C30',
      cardBorder: '#38BDF8',
      textPrimary: '#FAFAFA',
      textSecondary: '#38BDF8',
      textMuted: '#94A3B8',
      accent: '#38BDF8',
      accentGlow: 'rgba(56, 189, 248, 0.45)',
      highlight: '#0284C7',
      badgeBg: '#223252',
      badgeText: '#FAFAFA',
      tankTop: '#182238',
      tankBottom: '#080C17'
    },
    headerBg: '#0F172A',
    headerText: '#FAFAFA',
    heroGradient: 'linear-gradient(135deg, #182238 0%, #223252 100%)',
    actionBtnBg: '#38BDF8',
    actionBtnText: '#0F172A',
    cardHeaderBg: '#182238',
    cardSurface: '#131C30',
    cardGradient: 'linear-gradient(135deg, rgba(19, 28, 48, 0.95) 0%, rgba(34, 50, 82, 0.95) 100%)',
    backdropPattern: 'radial-gradient(circle at 20px 20px, rgba(56, 189, 248, 0.12) 2px, transparent 3px)',
    texturePattern: 'radial-gradient(ellipse at 50% 20%, rgba(100, 116, 139, 0.25), transparent 60%), radial-gradient(ellipse at 50% 90%, rgba(56, 189, 248, 0.18), transparent 60%)',
    swatches: ['#64748B', '#0284C7', '#0F172A', '#FAFAFA']
  },

  arctic_atlauz: {
    id: 'arctic_atlauz',
    name: 'Arctic Atlauz',
    tagline: 'Crisp Glacier Cyan & Sub-Zero Frost',
    description: 'Crisp glacier cyan controls with frost violet highlights over deep sub-zero navy canvas.',
    mood: 'Sub-Zero Glacier Focus',
    category: 'Blue & Azure',
    colors: {
      primary: '#06B6D4',
      secondary: '#6366F1',
      neutralDark: '#0A192F',
      neutralLight: '#F0F9FF',
      bgPrimary: '#0A192F',
      bgSecondary: '#102644',
      cardBg: '#0D1F38',
      cardBorder: '#06B6D4',
      textPrimary: '#F0F9FF',
      textSecondary: '#06B6D4',
      textMuted: '#7188A3',
      accent: '#06B6D4',
      accentGlow: 'rgba(6, 182, 212, 0.45)',
      highlight: '#6366F1',
      badgeBg: '#18385E',
      badgeText: '#F0F9FF',
      tankTop: '#102644',
      tankBottom: '#040C1A'
    },
    headerBg: '#0A192F',
    headerText: '#F0F9FF',
    heroGradient: 'linear-gradient(135deg, #102644 0%, #18385E 100%)',
    actionBtnBg: '#06B6D4',
    actionBtnText: '#0A192F',
    cardHeaderBg: '#102644',
    cardSurface: '#0D1F38',
    cardGradient: 'linear-gradient(135deg, rgba(13, 31, 56, 0.95) 0%, rgba(24, 56, 94, 0.95) 100%)',
    backdropPattern: 'repeating-linear-gradient(60deg, rgba(6, 182, 212, 0.06), rgba(6, 182, 212, 0.06) 1px, transparent 1px, transparent 12px)',
    texturePattern: 'radial-gradient(circle at 10% 10%, rgba(6, 182, 212, 0.25), transparent 50%), radial-gradient(circle at 90% 90%, rgba(99, 102, 241, 0.18), transparent 50%)',
    swatches: ['#06B6D4', '#6366F1', '#0A192F', '#F0F9FF']
  },

  techno_tuna: {
    id: 'techno_tuna',
    name: 'Techno Tuna',
    tagline: 'Deep Cyber Azure & Subdued Lime Accent',
    description: 'Mature cyber azure controls with subtle lime accents on deep cybernetic matrix dark canvas.',
    mood: 'Cybernetic Rhythm & Precision',
    category: 'Blue & Azure',
    colors: {
      primary: '#2563EB',
      secondary: '#84CC16',
      neutralDark: '#090D1A',
      neutralLight: '#F0F6FF',
      bgPrimary: '#090D1A',
      bgSecondary: '#121933',
      cardBg: '#0E1329',
      cardBorder: '#2563EB',
      textPrimary: '#F0F6FF',
      textSecondary: '#84CC16',
      textMuted: '#717FA6',
      accent: '#2563EB',
      accentGlow: 'rgba(37, 99, 235, 0.45)',
      highlight: '#84CC16',
      badgeBg: '#1B2447',
      badgeText: '#F0F6FF',
      tankTop: '#121933',
      tankBottom: '#04060E'
    },
    headerBg: '#090D1A',
    headerText: '#F0F6FF',
    heroGradient: 'linear-gradient(135deg, #121933 0%, #1B2447 100%)',
    actionBtnBg: '#2563EB',
    actionBtnText: '#FFFFFF',
    cardHeaderBg: '#121933',
    cardSurface: '#0E1329',
    cardGradient: 'linear-gradient(135deg, rgba(14, 19, 41, 0.95) 0%, rgba(27, 36, 71, 0.95) 100%)',
    backdropPattern: 'repeating-linear-gradient(90deg, rgba(132, 204, 22, 0.05), rgba(132, 204, 22, 0.05) 1px, transparent 1px, transparent 10px)',
    texturePattern: 'radial-gradient(ellipse at 50% 0%, rgba(37, 99, 235, 0.25), transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(132, 204, 22, 0.18), transparent 60%)',
    swatches: ['#2563EB', '#84CC16', '#090D1A', '#F0F6FF']
  },

  chrome_swordfish: {
    id: 'chrome_swordfish',
    name: 'Chrome Swordfish',
    tagline: 'Silvery Metallic Chrome & Deep Ocean Slate',
    description: 'Polished silvery chrome controls with blade blue highlights over deep ocean slate dark canvas.',
    mood: 'Metallic Precision & Focus',
    category: 'Blue & Azure',
    colors: {
      primary: '#94A3B8',
      secondary: '#38BDF8',
      neutralDark: '#0F172A',
      neutralLight: '#F8FAFC',
      bgPrimary: '#0F172A',
      bgSecondary: '#1E293B',
      cardBg: '#182238',
      cardBorder: '#94A3B8',
      textPrimary: '#F8FAFC',
      textSecondary: '#38BDF8',
      textMuted: '#94A3B8',
      accent: '#94A3B8',
      accentGlow: 'rgba(148, 163, 184, 0.45)',
      highlight: '#38BDF8',
      badgeBg: '#223252',
      badgeText: '#F8FAFC',
      tankTop: '#1E293B',
      tankBottom: '#080D1A'
    },
    headerBg: '#0F172A',
    headerText: '#F8FAFC',
    heroGradient: 'linear-gradient(135deg, #1E293B 0%, #223252 100%)',
    actionBtnBg: '#38BDF8',
    actionBtnText: '#0F172A',
    cardHeaderBg: '#1E293B',
    cardSurface: '#182238',
    cardGradient: 'linear-gradient(135deg, rgba(24, 34, 56, 0.95) 0%, rgba(34, 50, 82, 0.95) 100%)',
    backdropPattern: 'repeating-linear-gradient(45deg, rgba(148, 163, 184, 0.05), rgba(148, 163, 184, 0.05) 1px, transparent 1px, transparent 10px)',
    texturePattern: 'radial-gradient(circle at 80% 20%, rgba(148, 163, 184, 0.22), transparent 50%), radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.18), transparent 50%)',
    swatches: ['#94A3B8', '#38BDF8', '#0F172A', '#F8FAFC']
  },

  // ==================== INDIGO & VIOLET (ROYGBIV: I & V) ====================
  moonlight_delight: {
    id: 'moonlight_delight',
    name: 'Moonlight Delight',
    tagline: 'Nocturnal Indigo & Soft Lunar Violet',
    description: 'Soft lunar violet controls paired with starlight pink highlights on deep midnight purple.',
    mood: 'Deep Night Reflection & Synthesis',
    category: 'Indigo & Violet',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      neutralDark: '#130E2A',
      neutralLight: '#F5F3FF',
      bgPrimary: '#130E2A',
      bgSecondary: '#1E1742',
      cardBg: '#181236',
      cardBorder: '#8B5CF6',
      textPrimary: '#F5F3FF',
      textSecondary: '#EC4899',
      textMuted: '#998BBF',
      accent: '#8B5CF6',
      accentGlow: 'rgba(139, 92, 246, 0.45)',
      highlight: '#EC4899',
      badgeBg: '#2C215E',
      badgeText: '#F5F3FF',
      tankTop: '#1E1742',
      tankBottom: '#080516'
    },
    headerBg: '#130E2A',
    headerText: '#F5F3FF',
    heroGradient: 'linear-gradient(135deg, #1E1742 0%, #2C215E 100%)',
    actionBtnBg: '#8B5CF6',
    actionBtnText: '#FFFFFF',
    cardHeaderBg: '#1E1742',
    cardSurface: '#181236',
    cardGradient: 'linear-gradient(135deg, rgba(24, 18, 54, 0.95) 0%, rgba(44, 33, 94, 0.95) 100%)',
    backdropPattern: 'radial-gradient(circle at 15px 15px, rgba(139, 92, 246, 0.15) 1.5px, transparent 2px)',
    texturePattern: 'radial-gradient(circle at 70% 15%, rgba(139, 92, 246, 0.25), transparent 55%), radial-gradient(circle at 20% 85%, rgba(236, 72, 153, 0.18), transparent 55%)',
    swatches: ['#8B5CF6', '#EC4899', '#130E2A', '#F5F3FF']
  },

  coral_reef: {
    id: 'coral_reef',
    name: 'Coral Reef',
    tagline: 'Living Coral Pink & Anemone Reef',
    description: 'Living coral pink focus triggers complemented by anemone turquoise status tags on reef shadow.',
    mood: 'Creative Divergence & Visual Contrast',
    category: 'Indigo & Violet',
    colors: {
      primary: '#E11D48',
      secondary: '#0D9488',
      neutralDark: '#1A1216',
      neutralLight: '#FFF1F2',
      bgPrimary: '#1A1216',
      bgSecondary: '#2A1A22',
      cardBg: '#21151B',
      cardBorder: '#E11D48',
      textPrimary: '#FFF1F2',
      textSecondary: '#0D9488',
      textMuted: '#A68892',
      accent: '#E11D48',
      accentGlow: 'rgba(225, 29, 72, 0.45)',
      highlight: '#0D9488',
      badgeBg: '#3A232F',
      badgeText: '#FFF1F2',
      tankTop: '#2A1A22',
      tankBottom: '#0E0B0E'
    },
    headerBg: '#1A1216',
    headerText: '#FFF1F2',
    heroGradient: 'linear-gradient(135deg, #2A1A22 0%, #3A232F 100%)',
    actionBtnBg: '#E11D48',
    actionBtnText: '#FFFFFF',
    cardHeaderBg: '#2A1A22',
    cardSurface: '#21151B',
    cardGradient: 'linear-gradient(135deg, rgba(33, 21, 27, 0.95) 0%, rgba(58, 35, 47, 0.95) 100%)',
    backdropPattern: 'radial-gradient(circle at 12px 12px, rgba(13, 148, 136, 0.15) 2px, transparent 3px), radial-gradient(circle at 24px 24px, rgba(225, 29, 72, 0.15) 2px, transparent 3px)',
    texturePattern: 'radial-gradient(circle at 80% 20%, rgba(225, 29, 72, 0.25), transparent 50%), radial-gradient(circle at 20% 80%, rgba(13, 148, 136, 0.2), transparent 50%)',
    swatches: ['#E11D48', '#0D9488', '#1A1216', '#FFF1F2']
  },

  deep_dark: {
    id: 'deep_dark',
    name: 'Deep Dark',
    tagline: 'Abyssal Dark Slate & Subdued Cyber Blue',
    description: 'High-contrast abyssal dark slate canvas with subdued cyber blue wireframes for zero-distraction focus.',
    mood: 'Minimalist Cyber Abyssal Depth',
    category: 'Indigo & Violet',
    colors: {
      primary: '#38BDF8',
      secondary: '#F43F5E',
      neutralDark: '#05070A',
      neutralLight: '#F8FAFC',
      bgPrimary: '#05070A',
      bgSecondary: '#0A0F17',
      cardBg: '#080C12',
      cardBorder: '#38BDF8',
      textPrimary: '#F8FAFC',
      textSecondary: '#38BDF8',
      textMuted: '#64748B',
      accent: '#38BDF8',
      accentGlow: 'rgba(56, 189, 248, 0.45)',
      highlight: '#F43F5E',
      badgeBg: '#121824',
      badgeText: '#F8FAFC',
      tankTop: '#0A0F17',
      tankBottom: '#020305'
    },
    headerBg: '#05070A',
    headerText: '#F8FAFC',
    heroGradient: 'linear-gradient(135deg, #0A0F17 0%, #121824 100%)',
    actionBtnBg: '#38BDF8',
    actionBtnText: '#05070A',
    cardHeaderBg: '#0A0F17',
    cardSurface: '#080C12',
    cardGradient: 'linear-gradient(135deg, rgba(8, 12, 18, 0.95) 0%, rgba(18, 24, 36, 0.95) 100%)',
    backdropPattern: 'linear-gradient(to right, rgba(56, 189, 248, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.06) 1px, transparent 1px)',
    texturePattern: 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.2), transparent 60%)',
    swatches: ['#38BDF8', '#F43F5E', '#05070A', '#F8FAFC']
  },

  mellow_moon: {
    id: 'mellow_moon',
    name: 'Mellow Moon',
    tagline: 'Mellow Lunar Silver & Nocturnal Moonlight',
    description: 'Mellow lunar silver and subtle lavender glow over nocturnal moonlight indigo canvas.',
    mood: 'Nocturnal Moonlight Peace',
    category: 'Indigo & Violet',
    colors: {
      primary: '#C084FC',
      secondary: '#E879F9',
      neutralDark: '#140E24',
      neutralLight: '#FAF5FF',
      bgPrimary: '#140E24',
      bgSecondary: '#21163A',
      cardBg: '#1A112E',
      cardBorder: '#C084FC',
      textPrimary: '#FAF5FF',
      textSecondary: '#E879F9',
      textMuted: '#A391BD',
      accent: '#C084FC',
      accentGlow: 'rgba(192, 132, 252, 0.45)',
      highlight: '#E879F9',
      badgeBg: '#311E52',
      badgeText: '#FAF5FF',
      tankTop: '#21163A',
      tankBottom: '#0A0713'
    },
    headerBg: '#140E24',
    headerText: '#FAF5FF',
    heroGradient: 'linear-gradient(135deg, #21163A 0%, #311E52 100%)',
    actionBtnBg: '#C084FC',
    actionBtnText: '#140E24',
    cardHeaderBg: '#21163A',
    cardSurface: '#1A112E',
    cardGradient: 'linear-gradient(135deg, rgba(26, 17, 46, 0.95) 0%, rgba(49, 30, 82, 0.95) 100%)',
    backdropPattern: 'radial-gradient(circle at 18px 18px, rgba(192, 132, 252, 0.15) 2px, transparent 3px)',
    texturePattern: 'radial-gradient(circle at 75% 15%, rgba(192, 132, 252, 0.25), transparent 55%), radial-gradient(circle at 25% 85%, rgba(232, 121, 249, 0.18), transparent 55%)',
    swatches: ['#C084FC', '#E879F9', '#140E24', '#FAF5FF']
  },

  // ==================== STANDARDS ====================
  dark: {
    id: 'dark',
    name: 'Pure Monochrome Dark',
    tagline: 'Original Minimalist Standard',
    description: 'Classic high-contrast dark palette with deep blacks and pure white accents.',
    mood: 'Zero Distraction Standard',
    category: 'Standard',
    colors: {
      primary: '#ffffff',
      secondary: '#10b981',
      neutralDark: '#070707',
      neutralLight: '#ffffff',
      bgPrimary: '#070707',
      bgSecondary: '#0d0d0d',
      cardBg: '#0e0e0e',
      cardBorder: '#404040',
      textPrimary: '#ffffff',
      textSecondary: '#e5e5e5',
      textMuted: '#a3a3a3',
      accent: '#ffffff',
      accentGlow: 'rgba(255, 255, 255, 0.4)',
      highlight: '#10b981',
      badgeBg: '#262626',
      badgeText: '#ffffff',
      tankTop: '#141414',
      tankBottom: '#050505'
    },
    headerBg: '#070707',
    headerText: '#ffffff',
    heroGradient: 'linear-gradient(135deg, #121212 0%, #1f1f1f 100%)',
    actionBtnBg: '#ffffff',
    actionBtnText: '#000000',
    cardHeaderBg: '#0d0d0d',
    cardSurface: '#0e0e0e',
    cardGradient: 'linear-gradient(135deg, rgba(14, 14, 14, 0.95) 0%, rgba(22, 22, 22, 0.95) 100%)',
    backdropPattern: 'none',
    texturePattern: 'none',
    swatches: ['#ffffff', '#10b981', '#070707', '#ffffff']
  },

  light: {
    id: 'light',
    name: 'Paper Laboratory Light',
    tagline: 'High-Legibility Studio White',
    description: 'Crisp paper white with graphite typography and subtle contrast borders.',
    mood: 'Daylight Reading & Print Emulation',
    category: 'Standard',
    colors: {
      primary: '#2563eb',
      secondary: '#0284c7',
      neutralDark: '#0f172a',
      neutralLight: '#f8fafc',
      bgPrimary: '#f8fafc',
      bgSecondary: '#f1f5f9',
      cardBg: '#ffffff',
      cardBorder: '#94a3b8',
      textPrimary: '#0f172a',
      textSecondary: '#1e293b',
      textMuted: '#475569',
      accent: '#2563eb',
      accentGlow: 'rgba(37, 99, 235, 0.35)',
      highlight: '#0284c7',
      badgeBg: '#cbd5e1',
      badgeText: '#0f172a',
      tankTop: '#e2e8f0',
      tankBottom: '#cbd5e1'
    },
    headerBg: '#1e293b',
    headerText: '#ffffff',
    heroGradient: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
    actionBtnBg: '#2563eb',
    actionBtnText: '#ffffff',
    cardHeaderBg: '#f1f5f9',
    cardSurface: '#ffffff',
    cardGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(241, 245, 249, 0.98) 100%)',
    backdropPattern: 'none',
    texturePattern: 'none',
    swatches: ['#2563eb', '#0284c7', '#0f172a', '#f8fafc']
  }
};

export const FULLER_VIEW_PALETTES = {
  hub: {
    name: 'Command Primary',
    border: 'var(--theme-card-border)',
    accent: 'var(--theme-primary)',
    bg: 'var(--theme-hub-bg)'
  },
  library: {
    name: 'Indigo Archive',
    border: '#6366f1',
    accent: '#818cf8',
    bg: 'var(--theme-library-bg)'
  },
  workspace: {
    name: 'Emerald Focus',
    border: '#10b981',
    accent: '#34d399',
    bg: 'var(--theme-workspace-bg)'
  },
  companion: {
    name: 'Amethyst Intelligence',
    border: '#8b5cf6',
    accent: '#c084fc',
    bg: 'var(--theme-companion-bg)'
  },
  profile: {
    name: 'Amber Identity',
    border: '#f59e0b',
    accent: '#fbbf24',
    bg: 'var(--theme-profile-bg)'
  }
};

export const FULLER_SHELF_COLORS = {
  personal: {
    label: 'Personal Archive',
    headerBg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.35) 0%, rgba(30, 58, 138, 0.6) 100%)',
    borderColor: '#3b82f6',
    badgeBg: '#1e3a8a',
    badgeText: '#93c5fd',
    accent: '#3b82f6'
  },
  academic: {
    label: 'Academic Curricula',
    headerBg: 'linear-gradient(135deg, rgba(124, 58, 237, 0.35) 0%, rgba(76, 29, 149, 0.6) 100%)',
    borderColor: '#8b5cf6',
    badgeBg: '#4c1d95',
    badgeText: '#c4b5fd',
    accent: '#8b5cf6'
  },
  researcher: {
    label: 'Research & Intelligence',
    headerBg: 'linear-gradient(135deg, rgba(5, 150, 105, 0.35) 0%, rgba(6, 78, 59, 0.6) 100%)',
    borderColor: '#10b981',
    badgeBg: '#064e3b',
    badgeText: '#6ee7b7',
    accent: '#10b981'
  },
  educator: {
    label: 'Teaching & Modules',
    headerBg: 'linear-gradient(135deg, rgba(217, 119, 6, 0.35) 0%, rgba(120, 53, 15, 0.6) 100%)',
    borderColor: '#f59e0b',
    badgeBg: '#78350f',
    badgeText: '#fde68a',
    accent: '#f59e0b'
  }
};

export const FULLER_RESOURCE_CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; badgeBg: string }> = {
  ebook: { bg: 'rgba(30, 58, 138, 0.45)', border: '#3b82f6', text: '#93c5fd', badgeBg: '#1e3a8a' },
  presentation: { bg: 'rgba(120, 53, 15, 0.45)', border: '#f59e0b', text: '#fde68a', badgeBg: '#78350f' },
  notebook: { bg: 'rgba(6, 78, 59, 0.45)', border: '#10b981', text: '#6ee7b7', badgeBg: '#064e3b' },
  notepad: { bg: 'rgba(6, 78, 59, 0.4)', border: '#34d399', text: '#a7f3d0', badgeBg: '#065f46' },
  lesson: { bg: 'rgba(76, 29, 149, 0.45)', border: '#8b5cf6', text: '#c4b5fd', badgeBg: '#4c1d95' },
  document: { bg: 'rgba(88, 28, 135, 0.45)', border: '#a855f7', text: '#e9d5ff', badgeBg: '#581c87' },
  pdf: { bg: 'rgba(136, 19, 55, 0.45)', border: '#f43f5e', text: '#fecdd3', badgeBg: '#881337' },
  journal: { bg: 'rgba(22, 78, 99, 0.45)', border: '#06b6d4', text: '#a5f3fc', badgeBg: '#164e63' }
};

export const FULLER_HUB_QUADRANT_COLORS = {
  pinned: {
    title: 'Pinned Quick Launch',
    border: '#06b6d4',
    bg: 'linear-gradient(135deg, rgba(8, 145, 178, 0.3) 0%, rgba(22, 78, 99, 0.5) 100%)',
    badgeBg: '#164e63',
    badgeText: '#67e8f9',
    accent: '#06b6d4'
  },
  focus: {
    title: 'Active Focus Workspace',
    border: '#6366f1',
    bg: 'linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(30, 27, 75, 0.5) 100%)',
    badgeBg: '#1e1b4b',
    badgeText: '#a5b4fc',
    accent: '#818cf8'
  },
  due: {
    title: 'Due Activities & Alerts',
    border: '#f43f5e',
    bg: 'linear-gradient(135deg, rgba(225, 29, 72, 0.3) 0%, rgba(76, 5, 25, 0.5) 100%)',
    badgeBg: '#4c0519',
    badgeText: '#fda4af',
    accent: '#f43f5e'
  },
  todo: {
    title: 'To-Do & Milestones',
    border: '#10b981',
    bg: 'linear-gradient(135deg, rgba(5, 150, 105, 0.3) 0%, rgba(6, 78, 59, 0.5) 100%)',
    badgeBg: '#064e3b',
    badgeText: '#6ee7b7',
    accent: '#10b981'
  }
};

export const FULLER_WORKSPACE_TOOL_TAB_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  reader: { bg: 'rgba(37, 99, 235, 0.3)', border: '#3b82f6', text: '#93c5fd', glow: 'rgba(59, 130, 246, 0.5)' },
  editor: { bg: 'rgba(5, 150, 105, 0.3)', border: '#10b981', text: '#6ee7b7', glow: 'rgba(16, 185, 129, 0.5)' },
  flashcards: { bg: 'rgba(217, 119, 6, 0.3)', border: '#f59e0b', text: '#fde68a', glow: 'rgba(245, 158, 11, 0.5)' },
  canvas: { bg: 'rgba(124, 58, 237, 0.3)', border: '#8b5cf6', text: '#c4b5fd', glow: 'rgba(139, 92, 246, 0.5)' },
  audio: { bg: 'rgba(225, 29, 72, 0.3)', border: '#f43f5e', text: '#fda4af', glow: 'rgba(244, 63, 94, 0.5)' },
  quiz: { bg: 'rgba(8, 145, 178, 0.3)', border: '#06b6d4', text: '#a5f3fc', glow: 'rgba(6, 182, 212, 0.5)' },
  synthesis: { bg: 'rgba(79, 70, 229, 0.3)', border: '#6366f1', text: '#a5b4fc', glow: 'rgba(99, 102, 241, 0.5)' }
};

export function applyThemeToDocument(themeId: AppThemeId, intensityMode: import('./types').ThemeIntensityMode = 'focus') {
  const theme = ATLAUZ_THEMES[themeId] || ATLAUZ_THEMES.dark;
  const root = document.documentElement;

  root.style.setProperty('--theme-primary', theme.colors.primary);
  root.style.setProperty('--theme-secondary', theme.colors.secondary);
  root.style.setProperty('--theme-neutral-dark', theme.colors.neutralDark);
  root.style.setProperty('--theme-neutral-light', theme.colors.neutralLight);

  root.style.setProperty('--theme-bg-primary', theme.colors.bgPrimary);
  root.style.setProperty('--theme-bg-secondary', theme.colors.bgSecondary);
  root.style.setProperty('--theme-card-bg', theme.colors.cardBg);
  root.style.setProperty('--theme-card-border', theme.colors.cardBorder);
  root.style.setProperty('--theme-card-gradient', theme.cardGradient);
  root.style.setProperty('--theme-backdrop-pattern', theme.backdropPattern);

  root.style.setProperty('--theme-header-bg', theme.headerBg);
  root.style.setProperty('--theme-header-text', theme.headerText);
  root.style.setProperty('--theme-hero-bg', theme.heroGradient);
  root.style.setProperty('--theme-action-btn-bg', theme.actionBtnBg);
  root.style.setProperty('--theme-action-btn-text', theme.actionBtnText);
  root.style.setProperty('--theme-card-header-bg', theme.cardHeaderBg);
  root.style.setProperty('--theme-card-surface', theme.cardSurface);

  root.style.setProperty('--theme-text-primary', theme.colors.textPrimary);
  root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--theme-text-muted', theme.colors.textMuted);
  root.style.setProperty('--theme-accent', theme.colors.accent);
  root.style.setProperty('--theme-accent-glow', theme.colors.accentGlow);
  root.style.setProperty('--theme-highlight', theme.colors.highlight);
  root.style.setProperty('--theme-badge-bg', theme.colors.badgeBg);
  root.style.setProperty('--theme-badge-text', theme.colors.badgeText);
  root.style.setProperty('--theme-texture', theme.texturePattern);

  root.setAttribute('data-theme', themeId);
  root.setAttribute('data-theme-intensity', intensityMode);

  if (intensityMode === 'fuller') {
    root.style.setProperty(
      '--theme-hub-bg',
      `linear-gradient(135deg, ${theme.colors.bgPrimary} 0%, ${theme.colors.primary}22 100%)`
    );
    root.style.setProperty(
      '--theme-library-bg',
      `linear-gradient(135deg, ${theme.colors.bgPrimary} 0%, rgba(79, 70, 229, 0.2) 100%)`
    );
    root.style.setProperty(
      '--theme-workspace-bg',
      `linear-gradient(135deg, ${theme.colors.bgPrimary} 0%, rgba(5, 150, 105, 0.2) 100%)`
    );
    root.style.setProperty(
      '--theme-companion-bg',
      `linear-gradient(135deg, ${theme.colors.bgPrimary} 0%, rgba(124, 58, 237, 0.2) 100%)`
    );
    root.style.setProperty(
      '--theme-profile-bg',
      `linear-gradient(135deg, ${theme.colors.bgPrimary} 0%, rgba(217, 119, 6, 0.2) 100%)`
    );
  } else {
    root.style.setProperty('--theme-hub-bg', theme.colors.bgPrimary);
    root.style.setProperty('--theme-library-bg', theme.colors.bgPrimary);
    root.style.setProperty('--theme-workspace-bg', theme.colors.bgPrimary);
    root.style.setProperty('--theme-companion-bg', theme.colors.bgPrimary);
    root.style.setProperty('--theme-profile-bg', theme.colors.bgPrimary);
  }
}

