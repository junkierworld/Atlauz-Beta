import React from 'react';
import { LayoutDashboard, BookOpen, Layers, User } from 'lucide-react';
import { AtlauzLogo } from './AtlauzLogo';
import { haptics } from '../utils/haptics';

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

const BottomNavComponent: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const isDark = typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : true;
  
  return (
    <nav
      role="navigation"
      aria-label="Main application tabs"
      className={`fixed bottom-0 inset-x-0 z-40 pb-safe border-t backdrop-blur-md ${
        isDark
          ? 'bg-[#0d0d0d] border-white/10'
          : 'bg-white border-neutral-200'
      }`}
    >
      <div
        role="tablist"
        aria-label="Navigation hubs"
        className="flex justify-around items-center h-16 max-w-lg mx-auto px-2"
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
              onClick={() => {
                haptics.medium();
                onChangeTab(item.id);
              }}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors select-none relative"
              style={{
                WebkitTapHighlightColor: 'transparent',
                ...(isActive ? {
                  color: 'var(--theme-primary, #e63946)'
                } : {
                  color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
                    ? '#a1a1a1'
                    : '#a1a1a1'
                })
              }}
            >
              {item.isLogo ? (
                <AtlauzLogo
                  variant="icon"
                  size={18}
                  animated={isActive}
                  className={isActive ? 'opacity-100' : 'opacity-60'}
                />
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className={`text-[10px] tracking-wide font-mono ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
              {/* Active indicator: centered dot underneath */}
              {isActive && (
                <span 
                  className="w-1.5 h-1.5 rounded-full mt-0.5"
                  style={{
                    backgroundColor: 'var(--theme-primary, #e63946)',
                    boxShadow: '0 0 6px var(--theme-accent-glow, rgba(230, 57, 70, 0.4))'
                  }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const BottomNav = React.memo(BottomNavComponent);
