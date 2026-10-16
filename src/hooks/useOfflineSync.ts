import { useEffect, useCallback, useState, useRef } from 'react';
import { ResourceItem } from '../types';

export interface OfflineOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  resourceId: string;
  resource?: ResourceItem;
  updates?: Partial<ResourceItem>;
  timestamp: number;
  retries: number;
}

/**
 * Hook to manage offline operations and sync when online
 * Stores failed/pending operations in localStorage
 */
export function useOfflineSync(
  onSync?: (operations: OfflineOperation[]) => Promise<void>
) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [syncQueue, setSyncQueue] = useState<OfflineOperation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const STORAGE_KEY = 'atlauz_offline_queue_v1';
  const MAX_RETRIES = 3;

  /**
   * Load queued operations from localStorage
   */
  const loadQueue = useCallback((): OfflineOperation[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error loading offline queue:', err);
      return [];
    }
  }, []);

  /**
   * Save queue to localStorage
   */
  const saveQueue = useCallback((queue: OfflineOperation[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch (err) {
      console.error('Error saving offline queue:', err);
    }
  }, []);

  /**
   * Queue an operation for later sync
   */
  const queueOperation = useCallback(
    (operation: OfflineOperation) => {
      const newQueue = [...syncQueue, operation];
      setSyncQueue(newQueue);
      saveQueue(newQueue);
    },
    [syncQueue, saveQueue]
  );

  /**
   * Process sync queue when online
   */
  const processSyncQueue = useCallback(async () => {
    if (!isOnline || syncQueue.length === 0 || isSyncing) return;

    setIsSyncing(true);

    try {
      if (onSync) {
        await onSync(syncQueue);
      }
      // If sync successful, clear queue
      setSyncQueue([]);
      saveQueue([]);
    } catch (err) {
      console.error('Error syncing operations:', err);
      // Increment retry count for failed operations
      const updatedQueue = syncQueue.map(op => ({
        ...op,
        retries: op.retries + 1,
      }));
      setSyncQueue(updatedQueue);
      saveQueue(updatedQueue);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, syncQueue, isSyncing, onSync, saveQueue]);

  /**
   * Handle online/offline events
   */
  useEffect(() => {
    const handleOnline = () => {
      console.log('[Offline Sync] Connection restored');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('[Offline Sync] Connection lost');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Periodically try to sync when online
   */
  useEffect(() => {
    if (isOnline && syncQueue.length > 0) {
      // Try immediately
      processSyncQueue();
      // Then retry every 5 seconds
      syncIntervalRef.current = setInterval(processSyncQueue, 5000);
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [isOnline, syncQueue.length, processSyncQueue]);

  /**
   * Load initial queue on mount
   */
  useEffect(() => {
    const initialQueue = loadQueue();
    setSyncQueue(initialQueue);
  }, []);

  return {
    isOnline,
    syncQueue,
    queueOperation,
    processSyncQueue,
    isSyncing,
    hasPendingOperations: syncQueue.length > 0,
  };
}
