import { useState, useCallback } from 'react';
import { signOut } from '../lib/supabase';

interface UseLogoutReturn {
  logout: () => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to handle user logout
 */
export function useLogout(): UseLogoutReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: signOutError } = await signOut();

      if (signOutError) {
        throw signOutError;
      }

      return true;
    } catch (err: any) {
      const errorMessage = err?.message || 'Logout failed. Please try again.';
      setError(errorMessage);
      console.error('Logout error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    logout,
    loading,
    error,
  };
}

export default useLogout;
