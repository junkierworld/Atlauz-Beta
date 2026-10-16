/**
 * PHASE 3 OPTIMIZATION: Centralized state management with useReducer
 * Consolidates 16 separate state atoms into single reducer for:
 * - Better performance (single dispatch point)
 * - Easier debugging (action history)
 * - Type safety (explicit action types)
 * - Foundation for Redux/Zustand migration later
 */

import {
  CompanionState,
  CognitiveTelemetry,
  ScheduleBlock,
  ConnectedApp,
  UserAccountSettings,
  ResourceItem,
  CollaborativeBentoTile,
} from '../types';

// ============================================================================
// APP STATE TYPE
// ============================================================================

export interface AppState {
  companion: CompanionState;
  telemetry: CognitiveTelemetry;
  schedule: ScheduleBlock[];
  connectedApps: ConnectedApp[];
  settings: UserAccountSettings;
  resources: ResourceItem[];
  activeResourceId: string | null;
  isCreateModalOpen: boolean;
  isFishingModalOpen: boolean;
  isThemePickerOpen: boolean;
  collabTiles: CollaborativeBentoTile[];
  toastState: any;
  isDistractionFree: boolean;
  sidebarOpen: boolean;
}

// ============================================================================
// ACTION TYPES
// ============================================================================

export type AppAction =
  // Companion actions
  | { type: 'UPDATE_COMPANION'; payload: Partial<CompanionState> }
  | { type: 'CATCH_NEW_FISH'; payload: any }
  | { type: 'RENAME_FISH'; payload: { fishId: string; newName: string } }
  | { type: 'SET_PRIMARY_FISH'; payload: string }
  
  // Telemetry actions
  | { type: 'UPDATE_TELEMETRY'; payload: Partial<CognitiveTelemetry> }
  | { type: 'ADD_BONUS_STREAKS'; payload: number }
  | { type: 'TOGGLE_STREAK_FREEZE' }
  
  // Settings actions
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserAccountSettings> }
  | { type: 'TOGGLE_THEME' }
  | { type: 'LOCK_SCREEN' }
  
  // Connected apps actions
  | { type: 'TOGGLE_APP_CONNECTION'; payload: string }
  
  // Schedule actions
  | { type: 'UPDATE_SCHEDULE'; payload: ScheduleBlock[] }
  
  // Resource actions
  | { type: 'UPDATE_RESOURCES'; payload: ResourceItem[] }
  | { type: 'OPEN_RESOURCE'; payload: string }
  | { type: 'CLOSE_RESOURCE' }
  | { type: 'UPDATE_RESOURCE'; payload: { id: string; updated: Partial<ResourceItem> } }
  | { type: 'TOGGLE_PIN'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'UPDATE_BADGE'; payload: { id: string; badge: string } }
  | { type: 'UPDATE_COVER_COLOR'; payload: { id: string; color: string } }
  | { type: 'CREATE_RESOURCE'; payload: { resource: ResourceItem; openImmediately: boolean } }
  
  // Modal actions
  | { type: 'TOGGLE_CREATE_MODAL' }
  | { type: 'TOGGLE_FISHING_MODAL' }
  | { type: 'SET_THEME_PICKER_OPEN'; payload: boolean }
  
  // Collaborative tiles actions
  | { type: 'UPDATE_COLLAB_TILES'; payload: CollaborativeBentoTile[] }
  
  // Toast actions
  | { type: 'SHOW_TOAST'; payload: any }
  | { type: 'HIDE_TOAST' }
  
  // UI state actions
  | { type: 'TOGGLE_DISTRACTION_FREE' }
  | { type: 'SET_DISTRACTION_FREE'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean };

// ============================================================================
// REDUCER FUNCTION
// ============================================================================

export function appStateReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // ========== COMPANION ==========
    case 'UPDATE_COMPANION':
      return {
        ...state,
        companion: { ...state.companion, ...action.payload },
      };

    case 'CATCH_NEW_FISH': {
      const existing = state.companion.fishes || [];
      if (existing.length >= 5) return state;
      return {
        ...state,
        companion: {
          ...state.companion,
          fishes: [...existing, action.payload],
          primaryFishId: state.companion.primaryFishId || action.payload.id,
        },
        telemetry: {
          ...state.telemetry,
          streakDays: Math.max(0, state.telemetry.streakDays - 20),
        },
      };
    }

    case 'RENAME_FISH': {
      const updatedFishes = (state.companion.fishes || []).map(f =>
        f.id === action.payload.fishId ? { ...f, name: action.payload.newName } : f
      );
      const isPrimary = state.companion.primaryFishId === action.payload.fishId;
      return {
        ...state,
        companion: {
          ...state.companion,
          fishes: updatedFishes,
          name: isPrimary ? action.payload.newName : state.companion.name,
        },
      };
    }

    case 'SET_PRIMARY_FISH': {
      const target = state.companion.fishes?.find(f => f.id === action.payload);
      const updatedFishes = (state.companion.fishes || []).map(f => ({
        ...f,
        isPrimary: f.id === action.payload,
      }));
      return {
        ...state,
        companion: {
          ...state.companion,
          primaryFishId: action.payload,
          name: target?.name || state.companion.name,
          fishes: updatedFishes,
        },
      };
    }

    // ========== TELEMETRY ==========
    case 'UPDATE_TELEMETRY':
      return {
        ...state,
        telemetry: { ...state.telemetry, ...action.payload },
      };

    case 'ADD_BONUS_STREAKS':
      return {
        ...state,
        telemetry: {
          ...state.telemetry,
          streakDays: state.telemetry.streakDays + action.payload,
        },
      };

    case 'TOGGLE_STREAK_FREEZE':
      return {
        ...state,
        telemetry: {
          ...state.telemetry,
          isStreakFrozen: !state.telemetry.isStreakFrozen,
        },
      };

    // ========== SETTINGS ==========
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'TOGGLE_THEME': {
      const nextTheme = state.settings.theme === 'dark' ? 'light' : 'dark';
      if (nextTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
      return {
        ...state,
        settings: { ...state.settings, theme: nextTheme as any },
      };
    }

    case 'LOCK_SCREEN':
      return {
        ...state,
        settings: { ...state.settings, isLocked: true },
      };

    // ========== CONNECTED APPS ==========
    case 'TOGGLE_APP_CONNECTION':
      return {
        ...state,
        connectedApps: state.connectedApps.map(a =>
          a.id === action.payload
            ? {
                ...a,
                connected: !a.connected,
                statusText: !a.connected ? 'Connected via OAuth 2.0' : 'Disconnected',
              }
            : a
        ),
      };

    // ========== SCHEDULE ==========
    case 'UPDATE_SCHEDULE':
      return {
        ...state,
        schedule: action.payload,
      };

    // ========== RESOURCES ==========
    case 'UPDATE_RESOURCES':
      return {
        ...state,
        resources: action.payload,
      };

    case 'OPEN_RESOURCE':
      return {
        ...state,
        activeResourceId: action.payload,
      };

    case 'CLOSE_RESOURCE':
      return {
        ...state,
        activeResourceId: null,
      };

    case 'UPDATE_RESOURCE': {
      const updated = state.resources.map(item =>
        item.id === action.payload.id
          ? { ...item, ...action.payload.updated, updatedAt: 'Just now' }
          : item
      );
      return {
        ...state,
        resources: updated,
      };
    }

    case 'TOGGLE_PIN': {
      const updated = state.resources.map(r =>
        r.id === action.payload ? { ...r, isPinned: !r.isPinned } : r
      );
      return {
        ...state,
        resources: updated,
      };
    }

    case 'TOGGLE_FAVORITE': {
      const updated = state.resources.map(r =>
        r.id === action.payload ? { ...r, isFavorite: !r.isFavorite } : r
      );
      return {
        ...state,
        resources: updated,
      };
    }

    case 'UPDATE_BADGE':
      return {
        ...state,
        resources: state.resources.map(item =>
          item.id === action.payload.id
            ? { ...item, badge: action.payload.badge }
            : item
        ),
      };

    case 'UPDATE_COVER_COLOR':
      return {
        ...state,
        resources: state.resources.map(item =>
          item.id === action.payload.id
            ? { ...item, coverColor: action.payload.color }
            : item
        ),
      };

    case 'CREATE_RESOURCE': {
      const newResources = [action.payload.resource, ...state.resources];
      return {
        ...state,
        resources: newResources,
        activeResourceId: action.payload.openImmediately ? action.payload.resource.id : state.activeResourceId,
        isCreateModalOpen: false,
      };
    }

    // ========== MODALS ==========
    case 'TOGGLE_CREATE_MODAL':
      return {
        ...state,
        isCreateModalOpen: !state.isCreateModalOpen,
      };

    case 'TOGGLE_FISHING_MODAL':
      return {
        ...state,
        isFishingModalOpen: !state.isFishingModalOpen,
      };

    case 'SET_THEME_PICKER_OPEN':
      return {
        ...state,
        isThemePickerOpen: action.payload,
      };

    // ========== COLLAB TILES ==========
    case 'UPDATE_COLLAB_TILES':
      return {
        ...state,
        collabTiles: action.payload,
      };

    // ========== TOAST ==========
    case 'SHOW_TOAST':
      return {
        ...state,
        toastState: action.payload,
      };

    case 'HIDE_TOAST':
      return {
        ...state,
        toastState: null,
      };

    // ========== UI STATE ==========
    case 'TOGGLE_DISTRACTION_FREE': {
      const nextState = !state.isDistractionFree;
      return {
        ...state,
        isDistractionFree: nextState,
      };
    }

    case 'SET_DISTRACTION_FREE':
      return {
        ...state,
        isDistractionFree: action.payload,
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };

    case 'SET_SIDEBAR':
      return {
        ...state,
        sidebarOpen: action.payload,
      };

    default:
      return state;
  }
}
