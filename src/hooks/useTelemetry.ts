import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface TelemetryEvent {
  userId: string;
  event: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

/**
 * Hook to track user actions and telemetry
 * Used for analytics and understanding feature usage
 */
export function useTelemetry() {
  const { profile } = useAuth();

  /**
   * Track a telemetry event
   */
  const trackEvent = useCallback(
    async (
      event: string,
      metadata?: Record<string, any>
    ): Promise<void> => {
      if (!profile?.id || !supabase) return;

      try {
        const telemetryEvent: TelemetryEvent = {
          userId: profile.id,
          event,
          metadata,
          timestamp: Date.now(),
        };

        // Send to Supabase asynchronously (non-blocking)
        supabase
          .from('telemetry')
          .insert([
            {
              user_id: profile.id,
              event,
              metadata,
              created_at: new Date().toISOString(),
            },
          ])
          .then(({ error }) => {
            if (error) {
              console.warn('Telemetry error:', error);
            }
          });
      } catch (err) {
        console.error('Error tracking telemetry:', err);
      }
    },
    [profile?.id]
  );

  /**
   * Track common events
   */
  const events = {
    // Auth events
    userLogin: () => trackEvent('user_login'),
    userLogout: () => trackEvent('user_logout'),
    profileCompleted: (role: string) =>
      trackEvent('profile_completed', { role }),

    // Resource events
    resourceCreated: (type: string) =>
      trackEvent('resource_created', { type }),
    resourceUpdated: (type: string) =>
      trackEvent('resource_updated', { type }),
    resourceDeleted: (type: string) =>
      trackEvent('resource_deleted', { type }),
    resourceOpened: (type: string) =>
      trackEvent('resource_opened', { type }),
    resourcePinned: (type: string) =>
      trackEvent('resource_pinned', { type }),
    resourceShared: (type: string) =>
      trackEvent('resource_shared', { type }),

    // Feature events
    featureUsed: (feature: string) =>
      trackEvent('feature_used', { feature }),
    workspaceTabCreated: (purpose: string) =>
      trackEvent('workspace_tab_created', { purpose }),
    collaborationStarted: (resourceId: string) =>
      trackEvent('collaboration_started', { resourceId }),

    // Companion events
    companionInteracted: (action: string) =>
      trackEvent('companion_interacted', { action }),
    fishCaught: (species: string) =>
      trackEvent('fish_caught', { species }),

    // Settings events
    themeChanged: (theme: string) =>
      trackEvent('theme_changed', { theme }),
    settingsUpdated: (setting: string) =>
      trackEvent('settings_updated', { setting }),

    // Error events
    errorOccurred: (error: string) =>
      trackEvent('error_occurred', { error }),
  };

  return {
    trackEvent,
    events,
  };
}
