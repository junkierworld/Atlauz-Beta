import { useEffect } from 'react';
import { getCurrentUser, getUserProfile } from '../lib/supabase';
import { UserAccountSettings } from '../types';

interface UseAuthProfileProps {
  settings: UserAccountSettings;
  onUpdateSettings: (updates: Partial<UserAccountSettings>) => void;
}

/**
 * Hook to sync authenticated user's profile data with app settings
 * Fetches user profile from Supabase after login and updates settings
 */
export function useAuthProfile({ settings, onUpdateSettings }: UseAuthProfileProps) {
  useEffect(() => {
    const syncUserProfile = async () => {
      try {
        // Get current authenticated user
        const user = await getCurrentUser();
        
        if (!user) {
          return; // No authenticated user
        }

        // Don't fetch if username is already personalized (not default "User")
        if (settings.username && settings.username !== 'User') {
          return;
        }

        // Fetch user profile from Supabase
        const { profile } = await getUserProfile(user.id);

        if (profile) {
          // Update settings with profile data
          onUpdateSettings({
            username: profile.username || settings.username,
            email: profile.email || user.email || settings.email,
            firstName: profile.first_name || settings.firstName,
            lastName: profile.last_name || settings.lastName,
            role: profile.role || settings.role,
            // Add other profile fields as needed
          });

          console.log('✅ User profile synced from Supabase:', profile.username);
        }
      } catch (error) {
        console.error('Error syncing user profile:', error);
      }
    };

    syncUserProfile();
  }, []); // Run once on mount
}
