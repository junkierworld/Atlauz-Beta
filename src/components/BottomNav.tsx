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
          ? 'bg-[#0d0d0d] border-neutral-800'
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
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[48px] py-1.5 px-3 rounded-md transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-white select-none ${
                isActive
                  ? isDark
                    ? 'text-white bg-neutral-900 border border-neutral-700 shadow-sm'
                    : 'text-neutral-900 bg-neutral-100 border border-neutral-300 shadow-sm'
                  : isDark
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-950 border border-transparent'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border border-transparent'
              }`}
            >
              {item.isLogo ? (
                <AtlauzLogo
                  variant="icon"
                  size={18}
                  animated={isActive}
                  className={isActive ? 'opacity-100' : 'opacity-60'}
                />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              <span className={`text-[10px] tracking-wide font-mono ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-white -mt-0.5" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const BottomNav = React.memo(BottomNavComponent);
