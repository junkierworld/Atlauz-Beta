import React from 'react';
import { LayoutDashboard, BookOpen, Layers, User, Sparkles } from 'lucide-react';
import { AtlauzLogo } from './AtlauzLogo';

interface BottomNavProps {
  activeTab: 'hub' | 'library' | 'workspace' | 'companion' | 'profile';
  onChangeTab: (tab: 'hub' | 'library' | 'workspace' | 'companion' | 'profile') => void;
}

const NAV_ITEMS: Array<{
  id: 'hub' | 'library' | 'workspace' | 'companion' | 'profile';
  label: string;
  icon?: any;
  isLogo?: boolean;
}> = [
  { id: 'hub', label: 'Hub', icon: LayoutDashboard },
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'workspace', label: 'Workspace', icon: Layers },
  { id: 'companion', label: 'Companion', isLogo: true },
  { id: 'profile', label: 'Profile', icon: User }
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  return (
    <nav
      role="navigation"
      aria-label="Main application tabs"
      style={{
        backgroundColor: 'var(--theme-header-bg, #0d0d0d)',
        borderColor: 'var(--theme-card-border, #262626)'
      }}
      className="fixed bottom-0 inset-x-0 z-40 pb-safe border-t backdrop-blur-md transition-colors duration-300 shadow-2xl"
    >
      <div
        role="tablist"
        aria-label="Navigation hubs"
        className="flex items-center justify-between h-16 max-w-lg mx-auto px-3"
      >
        {NAV_ITEMS.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              aria-label={`${item.label} hub`}
              onClick={() => onChangeTab(item.id)}
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--theme-action-btn-bg, #ffffff)',
                      color: 'var(--theme-action-btn-text, #000000)',
                      borderColor: 'var(--theme-accent, rgba(255, 255, 255, 0.4))',
                      boxShadow: '0 0 12px var(--theme-accent-glow, rgba(255,255,255,0.3))'
                    }
                  : {
                      color: 'var(--theme-header-text, #ffffff)',
                      opacity: 0.75
                    }
              }
              className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[48px] py-1 px-1 rounded-xl transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-white select-none ${
                isActive
                  ? 'font-bold shadow-md border scale-105'
                  : 'hover:opacity-100 border border-transparent'
              }`}
            >
              {item.isLogo ? (
                <AtlauzLogo
                  variant="icon"
                  size={18}
                  animated={isActive}
                  className={isActive ? 'opacity-100' : 'opacity-80'}
                />
              ) : (
                <Icon className="w-4 h-4 shrink-0" />
              )}
              <span className={`text-[10px] tracking-wide font-mono ${isActive ? 'font-extrabold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
