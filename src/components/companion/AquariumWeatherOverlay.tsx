import React from 'react';
import { Sun, CloudRain, Moon, Sparkles, Waves } from 'lucide-react';

export type AquariumWeather = 'sunlight' | 'rain' | 'lunar';

interface AquariumWeatherOverlayProps {
  weather: AquariumWeather;
  onChangeWeather: (w: AquariumWeather) => void;
  isPlaytimeActive: boolean;
  onTogglePlaytime: () => void;
}

export const AquariumWeatherOverlay: React.FC<AquariumWeatherOverlayProps> = ({
  weather,
  onChangeWeather,
  isPlaytimeActive,
  onTogglePlaytime
}) => {
  return (
    <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1.5 rounded-xl border border-neutral-800 font-mono text-[11px] text-white select-none shadow-lg">
      {/* Weather Selector */}
      <button
        type="button"
        onClick={() => onChangeWeather('sunlight')}
        className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
          weather === 'sunlight' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-neutral-400 hover:text-white'
        }`}
        title="Sunlight God-Rays Ambient"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onChangeWeather('rain')}
        className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
          weather === 'rain' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-neutral-400 hover:text-white'
        }`}
        title="Rain Droplets & Benthic Ripples"
      >
        <CloudRain className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onChangeWeather('lunar')}
        className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
          weather === 'lunar' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-neutral-400 hover:text-white'
        }`}
        title="Midnight Lunar Shimmer"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-4 bg-neutral-800 mx-0.5" />

      {/* Playtime Mode Toggle */}
      <button
        type="button"
        onClick={onTogglePlaytime}
        className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 text-[10px] font-bold ${
          isPlaytimeActive
            ? 'bg-cyan-500 text-black shadow'
            : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
        }`}
        title="Toggle interactive fish playtime and touch tricks"
      >
        <Sparkles className="w-3 h-3" />
        <span>{isPlaytimeActive ? 'Playing' : 'Play'}</span>
      </button>
    </div>
  );
};
