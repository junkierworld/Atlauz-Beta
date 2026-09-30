import { FishCompanion } from '../types';

export interface FishSpeciesTemplate {
  species: string;
  defaultName: string;
  color: string;
  accentColor: string;
  tailType: 'veil' | 'fan' | 'ribbon' | 'sword' | 'glow';
  personality: string;
  description: string;
}

export const SPECIES_TEMPLATES: FishSpeciesTemplate[] = [
  {
    species: 'Monochrome Veil Tetra',
    defaultName: 'Finley',
    color: '#ffffff',
    accentColor: '#888888',
    tailType: 'veil',
    personality: 'Curious & Calm Flow',
    description: 'Minimalist high-contrast vector silhouette designed for clean visual telemetry.'
  },
  {
    species: 'Bright Silver Koi',
    defaultName: 'Apollo',
    color: '#e5e5e5',
    accentColor: '#999999',
    tailType: 'fan',
    personality: 'Resilient & Energizing',
    description: 'Precision wireframe swimmer designed for deep conceptual sprints.'
  },
  {
    species: 'Charcoal Angelfish',
    defaultName: 'Celeste',
    color: '#a3a3a3',
    accentColor: '#525252',
    tailType: 'ribbon',
    personality: 'Wise & Contemplative',
    description: 'Glides quietly across the wireframe grid with measured poise.'
  },
  {
    species: 'Steel Blade Betta',
    defaultName: 'Marina',
    color: '#cccccc',
    accentColor: '#666666',
    tailType: 'sword',
    personality: 'Bold & Determined',
    description: 'Sharp architectural profile with high-efficiency kinetic motion.'
  },
  {
    species: 'Graphite Ghost Guppy',
    defaultName: 'Sage',
    color: '#d4d4d4',
    accentColor: '#737373',
    tailType: 'glow',
    personality: 'Playful & Mindful',
    description: 'Lightweight telemetry swimmer indicating active mental restoration.'
  },
  {
    species: 'Obsidian Reef Fin',
    defaultName: 'Echo',
    color: '#ffffff',
    accentColor: '#404040',
    tailType: 'veil',
    personality: 'Deep Thinker',
    description: 'Monochrome deep-focus specimen thriving in late-night sessions.'
  }
];

export function generateRandomFish(existingCount: number): FishCompanion {
  // Pick species not already in tank if possible
  const pool = SPECIES_TEMPLATES.slice(1); // skip default
  const template = pool[Math.floor(Math.random() * pool.length)] || SPECIES_TEMPLATES[0];

  return {
    id: `fish-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: template.defaultName,
    species: template.species,
    color: template.color,
    accentColor: template.accentColor,
    tailType: template.tailType,
    personality: template.personality,
    size: 0.9 + Math.random() * 0.25,
    adoptedAt: `Reeled in via 20 Streaks (${new Date().toLocaleDateString()})`,
    isPrimary: false
  };
}
