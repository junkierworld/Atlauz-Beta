import { useEffect, useCallback, useState } from 'react';
import { ResourceItem } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

/**
 * Hook to persist resources to Supabase
 * Automatically syncs resources on create/update/delete
 */
export function useResourcePersistence() {
  const { profile } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load all resources from Supabase for current user
   */
  const loadResources = useCallback(async (): Promise<ResourceItem[]> => {
    if (!profile?.id) return [];

    try {
      setIsSyncing(true);
      const { data, error: fetchError } = await supabase
        .from('resources')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      return (data || []).map(row => transformFromDb(row));
    } catch (err: any) {
      console.error('Error loading resources:', err);
      setError(err.message);
      return [];
    } finally {
      setIsSyncing(false);
    }
  }, [profile?.id]);

  /**
   * Save a single resource to Supabase
   */
  const saveResource = useCallback(
    async (resource: ResourceItem): Promise<boolean> => {
      if (!profile?.id) return false;

      try {
        setIsSyncing(true);
        const dbResource = transformToDb(resource, profile.id);

        const { error: upsertError } = await supabase
          .from('resources')
          .upsert(dbResource, { onConflict: 'id' });

        if (upsertError) throw upsertError;

        return true;
      } catch (err: any) {
        console.error('Error saving resource:', err);
        setError(err.message);
        return false;
      } finally {
        setIsSyncing(false);
      }
    },
    [profile?.id]
  );

  /**
   * Update a resource in Supabase
   */
  const updateResource = useCallback(
    async (id: string, updates: Partial<ResourceItem>): Promise<boolean> => {
      if (!profile?.id) return false;

      try {
        setIsSyncing(true);
        const dbUpdates = {
          ...transformToDb(updates as ResourceItem, profile.id),
          updated_at: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
          .from('resources')
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', profile.id);

        if (updateError) throw updateError;

        return true;
      } catch (err: any) {
        console.error('Error updating resource:', err);
        setError(err.message);
        return false;
      } finally {
        setIsSyncing(false);
      }
    },
    [profile?.id]
  );

  /**
   * Delete a resource from Supabase
   */
  const deleteResource = useCallback(
    async (id: string): Promise<boolean> => {
      if (!profile?.id) return false;

      try {
        setIsSyncing(true);
        const { error: deleteError } = await supabase
          .from('resources')
          .delete()
          .eq('id', id)
          .eq('user_id', profile.id);

        if (deleteError) throw deleteError;

        return true;
      } catch (err: any) {
        console.error('Error deleting resource:', err);
        setError(err.message);
        return false;
      } finally {
        setIsSyncing(false);
      }
    },
    [profile?.id]
  );

  return {
    loadResources,
    saveResource,
    updateResource,
    deleteResource,
    isSyncing,
    error,
  };
}

/**
 * Transform database row to ResourceItem
 */
function transformFromDb(row: any): ResourceItem {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description || '',
    category: row.category || '',
    tags: row.tags || [],
    coverColor: row.cover_color || '#ffffff',
    isPinned: row.is_pinned || false,
    isFavorite: row.is_favorite || false,
    badge: row.badge || 'Core',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    roleShelf: row.role_shelf,
    metadata: row.metadata || {},
  };
}

/**
 * Transform ResourceItem to database format
 */
function transformToDb(resource: Partial<ResourceItem>, userId: string) {
  return {
    id: resource.id,
    user_id: userId,
    type: resource.type,
    title: resource.title,
    description: resource.description,
    category: resource.category,
    tags: resource.tags,
    cover_color: resource.coverColor,
    is_pinned: resource.isPinned,
    is_favorite: resource.isFavorite,
    badge: resource.badge,
    metadata: resource.metadata,
    role_shelf: resource.roleShelf,
  };
}
