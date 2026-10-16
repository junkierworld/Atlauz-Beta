import React, { useState } from 'react';
import { Menu, ChevronRight, Moon, Sun, Palette, Sparkles, LogOut, Settings, User } from 'lucide-react';
import { UserAccountSettings } from '../types';
import { FocusShiftIcon } from './FocusShiftIcon';
import { AtlauzLogo } from './AtlauzLogo';
import { ATLAUZ_THEMES } from '../themes';

interface HeaderProps {
  activeTab: 'hub' | 'library' | 'workspace' | 'companion' | 'profile';
  onOpenSidebar: () => void;
  settings: UserAccountSettings;
  onToggleTheme: () => void;
  onToggleThemeIntensity?: () => void;
  onOpenThemePicker?: () => void;
  onLockScreen?: () => void;
  isDistractionFree?: boolean;
  onToggleDistractionFree?: (active?: boolean) => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenSidebar,
  settings,
  onToggleTheme,
  onToggleThemeIntensity,
  onOpenThemePicker,
  isDistractionFree = false,
  onToggleDistractionFree,
  onOpenProfile,
  onLogout
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // When in Distraction-Free mode, hide the entire global header so only the workspace cards remain
  if (isDistractionFree) {
    return null;
  }

  const currentThemeMeta = ATLAUZ_THEMES[settings.theme] || ATLAUZ_THEMES.dark;

  const getSubTitle = () => {
    switch (activeTab) {
      case 'hub':
        return 'Daily Hub';
      case 'library':
        return 'Shelves & Active Notes';
      case 'workspace':
        return 'Active Workspace';
      case 'companion':
        return 'Companion & Aquarium';
      case 'profile':
        return `${settings.role || 'Scholar'} Ecosystem & Settings`;
      default:
        return 'Scholar Ecosystem';
    }
  };

  return (
    <header
      style={{
        backgroundColor: 'var(--theme-header-bg, #0d0d0d)',
        color: 'var(--theme-header-text, #ffffff)',
        borderColor: 'var(--theme-card-border, #262626)'
      }}
      className="fixed top-0 inset-x-0 z-50 border-b shadow-lg transition-colors duration-300"
    >
      {/* Top Primary Bar - Clean, Breathable, Vibrant Theme Immersion */}
      <div className="h-16 px-3 sm:px-5 max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Navigation Menu Trigger */}
        <div className="flex items-center gap-2">
          <button
            id="btnOpenSidebar"
            onClick={onOpenSidebar}
            aria-label="Open Workspace Navigation Sitemap"
            title="Open Atlauz Navigation Sitemap"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'var(--theme-header-text, #ffffff)'
            }}
            className="min-h-[44px] min-w-[44px] px-3.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all border text-xs font-medium focus-visible:ring-2 focus-visible:ring-white shadow-xs"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider font-bold">MENU</span>
          </button>
        </div>

        {/* Center: Brand Identity */}
        <div className="flex flex-col items-center justify-center select-none">
          <div className="flex items-center gap-2">
            <AtlauzLogo variant="icon" size={20} animated={true} />
            <AtlauzLogo variant="wordmark" size="xs" animated={true} />
            <span
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'var(--theme-header-text, #ffffff)'
              }}
              className="font-mono text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider shadow-xs"
            >
              v1.2.0
            </span>
          </div>
          <span
            style={{ opacity: 0.9 }}
            className="text-[10px] tracking-widest uppercase font-bold mt-0.5"
          >
            {getSubTitle()}
          </span>
        </div>

        {/* Right: Focused Controls (Touch-Friendly Targets >= 44x44px) */}
        <div className="flex items-center gap-2">
          {/* Distraction-Free Toggle */}
          {onToggleDistractionFree && (
            <button
              onClick={() => onToggleDistractionFree(true)}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'var(--theme-header-text, #ffffff)'
              }}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-all hover:opacity-90 active:scale-95 focus-visible:ring-2 focus-visible:ring-white shadow-xs"
              title="Enter No Distraction Focus Shift Mode"
              aria-label="Enter Focus Shift Mode"
            >
              <FocusShiftIcon size={16} active={true} />
              <span className="hidden md:inline font-mono text-xs font-bold">Focus Shift</span>
            </button>
          )}

          {/* Theme Palette Gallery Quick Button - MOVED TO CENTER RIGHT */}
          <button
            onClick={onOpenThemePicker}
            style={{
              backgroundColor: 'var(--theme-action-btn-bg, #ffffff)',
              color: 'var(--theme-action-btn-text, #000000)',
              borderColor: 'rgba(255, 255, 255, 0.4)'
            }}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border font-bold text-xs transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-white shadow-md group"
            title="Choose from 25 Handcrafted Living Themes"
            aria-label="Choose Conceptual Theme"
          >
            <Palette className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="hidden lg:inline text-[11px] font-mono font-extrabold uppercase">
              {currentThemeMeta.name.split(' ')[0]}
            </span>
          </button>

          {/* User Profile Dropdown Button - FAR RIGHT */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{
                backgroundColor: 'var(--theme-primary, #e63946)',
                borderColor: 'var(--theme-accent, #ffffff)'
              }}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border-2 font-bold text-xs transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-white shadow-md"
              title="User Profile & Settings"
              aria-label="User Profile"
            >
              <span className="text-white font-bold text-xs uppercase tracking-wider">
                {settings.username?.slice(0, 2) || 'JU'}
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-48 rounded-lg bg-neutral-900 border border-neutral-700 shadow-2xl z-50 animate-fade-in overflow-hidden"
                style={{
                  backgroundColor: 'var(--theme-card-bg, #121212)',
                  borderColor: 'var(--theme-card-border, #262626)'
                }}
              >
                {/* Profile Header */}
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--theme-card-border, #262626)' }}>
                  <p className="text-xs font-bold text-neutral-300">{settings.username || 'User'}</p>
                  <p className="text-[10px] text-neutral-500">{settings.email || 'user@atlauz.io'}</p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      onOpenProfile?.();
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-neutral-200 hover:bg-neutral-800 transition-colors flex items-center gap-2 active:scale-95"
                    style={{ '--hover-bg': 'var(--theme-bg-secondary, #1a1a1a)' } as React.CSSProperties}
                  >
                    <Settings className="w-4 h-4 text-neutral-400" />
                    Profile & Settings
                  </button>

                  <button
                    onClick={() => {
                      onLogout?.();
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-red-400 hover:bg-red-950/30 transition-colors flex items-center gap-2 border-t active:scale-95"
                    style={{ borderColor: 'var(--theme-card-border, #262626)' }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Close dropdown when clicking outside */}
          {isProfileOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsProfileOpen(false)}
              style={{ pointerEvents: 'auto' }}
            />
          )}
        </div>
      </div>
    </header>
  );
};
