import React from 'react';
import { Menu, ChevronRight, Moon, Sun, Lock } from 'lucide-react';
import { UserAccountSettings } from '../types';
import { FocusShiftIcon } from './FocusShiftIcon';
import { AtlauzLogo } from './AtlauzLogo';

interface HeaderProps {
  activeTab: 'hub' | 'library' | 'workspace' | 'companion' | 'profile';
  onOpenSidebar: () => void;
  settings: UserAccountSettings;
  onToggleTheme: () => void;
  onLockScreen: () => void;
  isDistractionFree?: boolean;
  onToggleDistractionFree?: (active?: boolean) => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({
  activeTab,
  onOpenSidebar,
  settings,
  onToggleTheme,
  onLockScreen,
  isDistractionFree = false,
  onToggleDistractionFree
}) => {
  // When in Distraction-Free mode, hide the entire global header so only the workspace cards remain
  if (isDistractionFree) {
    return null;
  }

  const getSubTitle = () => {
    switch (activeTab) {
      case 'hub':
        return 'Daily Hub';
      case 'library':
        return 'Custom Bookshelf & Notes';
      case 'workspace':
        return 'Active Workspace';
      case 'companion':
        return 'Companion & Well-being';
      case 'profile':
        return `${settings.role || 'Scholar'} Ecosystem & Settings`;
      default:
        return 'Scholar Ecosystem';
    }
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 ${settings.theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-200'} border-b`}>
      {/* Top Primary Bar */}
      <div className="h-16 px-3 sm:px-4 max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Navigation Menu Trigger (Mobile-First Hamburger & Desktop Sitemap) */}
        <div className="flex items-center gap-2">
          <button
            id="btnOpenSidebar"
            onClick={onOpenSidebar}
            aria-label="Open Workspace Navigation Sitemap"
            title="Open Atlauz Navigation Sitemap"
            className="min-h-[44px] min-w-[44px] px-3 rounded-md flex items-center justify-center gap-1.5 text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 active:scale-95 transition-all border border-neutral-700 text-xs font-medium focus-visible:ring-2 focus-visible:ring-white"
          >
            <Menu className="w-4 h-4 text-neutral-200" />
            <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-neutral-400">[MENU]</span>
          </button>
        </div>

        {/* Center: Brand & Prototype Indicator */}
        <div className="flex flex-col items-center justify-center select-none cursor-pointer">
          <div className="flex items-center gap-2">
            <AtlauzLogo variant="icon" size={20} animated={true} />
            <AtlauzLogo variant="wordmark" size="xs" animated={true} />
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 font-bold uppercase tracking-wider">
              v1.0 BETA
            </span>
          </div>
          <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-medium mt-0.5">
            {getSubTitle()}
          </span>
        </div>

        {/* Right: Functional Controls (Touch-Friendly Targets >= 44x44px) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Distraction-Free Toggle */}
          {onToggleDistractionFree && (
            <button
              onClick={() => onToggleDistractionFree(true)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-white"
              title="Enter No Distraction Focus Shift Mode"
              aria-label="Enter Focus Shift Mode"
            >
              <FocusShiftIcon size={16} active={true} />
              <span className="hidden md:inline">Focus Shift</span>
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border text-xs transition-all focus-visible:ring-2 focus-visible:ring-white ${
              settings.theme === 'dark'
                ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-700 hover:text-neutral-900'
            }`}
            title="Toggle Light/Dark Theme"
            aria-label="Toggle Theme"
          >
            {settings.theme === 'dark' ? (
              <>
                <Moon className="w-4 h-4" />
                <span className="hidden lg:inline text-[11px]">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4" />
                <span className="hidden lg:inline text-[11px]">Light</span>
              </>
            )}
          </button>

          {/* Quick Lock Button */}
          <button
            onClick={onLockScreen}
            className={`min-h-[44px] min-w-[44px] rounded-md border flex items-center justify-center active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-white ${
              settings.theme === 'dark'
                ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-700 hover:text-neutral-900'
            }`}
            title="Lock Vault with Passkey"
            aria-label="Lock Session Vault"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Profile Badge */}
          <div
            className={`min-h-[44px] min-w-[44px] rounded-md border flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
              settings.theme === 'dark'
                ? 'bg-neutral-900 border-neutral-700 text-white'
                : 'bg-neutral-100 border-neutral-300 text-neutral-900'
            }`}
            title={`Logged in as @${settings.username}`}
            aria-label={`User profile: ${settings.username}`}
          >
            {settings.username.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Prototype Status Bar (functional, clean, unpretentious) */}
      <div className={`h-6 px-4 border-t flex items-center justify-between text-[11px] font-mono ${
        settings.theme === 'dark'
          ? 'bg-[#111111] border-neutral-800 text-neutral-400'
          : 'bg-neutral-50 border-neutral-200 text-neutral-600'
      }`}>
        <div className="flex items-center gap-2 truncate">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${settings.theme === 'dark' ? 'bg-neutral-400' : 'bg-neutral-600'}`}></span>
          <span className={`font-medium truncate ${settings.theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
            {activeTab === 'workspace' ? 'Focus Shift: 0-Context Switch Active' : 'System: Operational'}
          </span>
          <span className={settings.theme === 'dark' ? 'text-neutral-600' : 'text-neutral-400'}>/</span>
          <span className={`hidden sm:inline ${settings.theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Local Workspace Cached
          </span>
        </div>

        <div className={`flex items-center gap-1.5 text-[10px] shrink-0 ${settings.theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${settings.theme === 'dark' ? 'bg-white' : 'bg-neutral-900'}`}></span>
          <span>v1.0-PROTO</span>
        </div>
      </div>
    </header>
  );
};

export const Header = React.memo(HeaderComponent);
