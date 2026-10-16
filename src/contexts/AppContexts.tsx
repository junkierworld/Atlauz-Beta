import React, { createContext, useContext } from 'react';
import { UserAccountSettings, ResourceItem } from '../types';

/**
 * PHASE 3 OPTIMIZATION: Context API to eliminate prop drilling
 * Reduces re-renders and simplifies component interfaces
 */

// ============================================================================
// SETTINGS CONTEXT
// ============================================================================

export interface SettingsContextType {
  settings: UserAccountSettings;
  onUpdateSettings: (updated: Partial<UserAccountSettings>) => void;
  onToggleTheme: () => void;
  onLockScreen: () => void;
}

export const SettingsContext = createContext<SettingsContextType | null>(null);

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}

// ============================================================================
// TOAST CONTEXT
// ============================================================================

export interface ToastContextType {
  showToast: (msg: string | { message: string; type?: 'info' | 'success' | 'warning' | 'error'; onUndo?: () => void; undoLabel?: string }) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

// ============================================================================
// NAVIGATION CONTEXT
// ============================================================================

export type TabType = 'hub' | 'library' | 'workspace' | 'companion' | 'profile';

export interface NavigationContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isDistractionFree: boolean;
  setIsDistractionFree: (enabled: boolean) => void;
}

export const NavigationContext = createContext<NavigationContextType | null>(null);

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

// ============================================================================
// RESOURCE CONTEXT
// ============================================================================

export interface ResourceContextType {
  activeResourceId: string | null;
  onOpenResource: (resource: ResourceItem) => void;
  onCloseResource: () => void;
}

export const ResourceContext = createContext<ResourceContextType | null>(null);

export function useResource(): ResourceContextType {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResource must be used within ResourceProvider');
  }
  return context;
}
