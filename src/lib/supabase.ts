import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase not configured. ' +
    'App will work offline-only using localStorage. ' +
    'To enable cloud features, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local'
  );
}

// Only create Supabase client if credentials are available
// This prevents errors during development without backend
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export const isOfflineMode = !isSupabaseConfigured;

/**
 * Get current user session
 */
export async function getCurrentSession() {
  if (!supabase) return null;
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  if (!supabase) return null;
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string) {
  if (!supabase) {
    return { user: null, session: null, error: 'Offline mode: signup not available' };
  }
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    return { user: null, session: null, error };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  if (!supabase) {
    return { user: null, session: null, error: 'Offline mode: signin not available' };
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    return { user: null, session: null, error };
  }
}

/**
 * Sign out (logout)
 */
export async function signOut() {
  if (!supabase) {
    return { error: null };
  }
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

/**
 * Create user profile
 */
export async function createUserProfile(
  userId: string,
  username: string,
  role: 'Student' | 'Researcher' | 'Educator',
  email?: string,
  firstName?: string,
  lastName?: string
) {
  if (!supabase) {
    return { profile: null, error: 'Offline mode: profile creation not available' };
  }
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: userId,
          username,
          role,
          email: email || '',
          first_name: firstName || '',
          last_name: lastName || '',
          theme: 'dark',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return { profile: data?.[0], error: null };
  } catch (error) {
    return { profile: null, error };
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  if (!supabase) {
    return { profile: null, error: 'Offline mode: profile fetching not available' };
  }
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    return { profile: null, error };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Record<string, any>
) {
  if (!supabase) {
    return { profile: null, error: 'Offline mode: profile update not available' };
  }
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    return { profile: null, error };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (user: any, session: any) => void
) {
  if (!supabase) {
    console.warn('Offline mode: auth state changes not available');
    return () => {};
  }
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user, session);
  });

  return data?.subscription?.unsubscribe || (() => {});
}
