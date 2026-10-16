/**
 * Atlauz High-Fidelity Local Storage & State Persistence Layer
 * Provides automatic, fault-tolerant persistence for resources, settings, telemetry, and study states.
 */

const STORAGE_KEYS = {
  RESOURCES: 'atlauz_resources_v2',
  SETTINGS: 'atlauz_settings_v2',
  TELEMETRY: 'atlauz_telemetry_v2',
  COMPANION: 'atlauz_companion_v2',
  TASKS: 'atlauz_tasks_v2',
  WORKSPACE_TABS: 'atlauz_workspace_tabs_v2',
  ACTIVE_SESSION: 'atlauz_active_session_v2',
  LEARNING_PATHS: 'atlauz_learning_paths_v2',
  EARNED_CERTIFICATES: 'atlauz_earned_certificates_v2',
  FLASHCARDS: 'atlauz_flashcards_v2',
  STUDY_ROOMS: 'atlauz_study_rooms_v2',
  COMPETENCIES: 'atlauz_competencies_v2',
  DAILY_REFLECTIONS: 'atlauz_daily_reflections_v2'
};

export const loadStoredData = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[Atlauz Storage] Failed to load key "${key}":`, err);
    return fallback;
  }
};

export const saveStoredData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`[Atlauz Storage] Failed to save key "${key}":`, err);
  }
};

export const exportUserDataBackup = (): string => {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    version: '2.0.0',
    resources: loadStoredData(STORAGE_KEYS.RESOURCES, null),
    settings: loadStoredData(STORAGE_KEYS.SETTINGS, null),
    telemetry: loadStoredData(STORAGE_KEYS.TELEMETRY, null),
    companion: loadStoredData(STORAGE_KEYS.COMPANION, null),
    tasks: loadStoredData(STORAGE_KEYS.TASKS, null),
    learningPaths: loadStoredData(STORAGE_KEYS.LEARNING_PATHS, null),
    earnedCertificates: loadStoredData(STORAGE_KEYS.EARNED_CERTIFICATES, null)
  };
  return JSON.stringify(exportPayload, null, 2);
};

export const importUserDataBackup = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') return false;

    if (parsed.resources) saveStoredData(STORAGE_KEYS.RESOURCES, parsed.resources);
    if (parsed.settings) saveStoredData(STORAGE_KEYS.SETTINGS, parsed.settings);
    if (parsed.telemetry) saveStoredData(STORAGE_KEYS.TELEMETRY, parsed.telemetry);
    if (parsed.companion) saveStoredData(STORAGE_KEYS.COMPANION, parsed.companion);
    if (parsed.tasks) saveStoredData(STORAGE_KEYS.TASKS, parsed.tasks);
    if (parsed.learningPaths) saveStoredData(STORAGE_KEYS.LEARNING_PATHS, parsed.learningPaths);
    if (parsed.earnedCertificates) saveStoredData(STORAGE_KEYS.EARNED_CERTIFICATES, parsed.earnedCertificates);

    return true;
  } catch (err) {
    console.error('[Atlauz Storage] Import failed:', err);
    return false;
  }
};

/**
 * Clear user session data WITHOUT destroying learning data.
 * Preserves: resources, learning paths, certificates, companion, telemetry
 * Clears: active session, auth tokens, temporary workspace state
 * 
 * This prevents data loss on logout while cleaning up session state.
 */
export const clearUserSession = (): void => {
  try {
    // Clear only session/auth-related keys, NOT user learning data
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    localStorage.removeItem(STORAGE_KEYS.WORKSPACE_TABS);
    
    // Reset settings to defaults (keeps theme preference)
    const currentSettings = loadStoredData(STORAGE_KEYS.SETTINGS, {});
    const clearedSettings = {
      ...currentSettings,
      isLocked: false,
      // Keep theme and intensity, clear other session state
    };
    saveStoredData(STORAGE_KEYS.SETTINGS, clearedSettings);
    
    console.log('[Atlauz Storage] User session cleared (user data preserved)');
  } catch (err) {
    console.error('[Atlauz Storage] Failed to clear user session:', err);
  }
};

export { STORAGE_KEYS };
