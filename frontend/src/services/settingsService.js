import { readValue, writeValue, STORAGE_KEYS } from './storageService'
import { issues } from '../data/issues'
import { apiClient } from './apiClient'
import { isOnline } from './connectivityService'

export const DEFAULT_SETTINGS = {
  theme: 'dark',
  automaticDiagnostics: true,
  saveHistory: true,
  onlineAIEnabled: true,
  offlineFallbackEnabled: true,
}

export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...readValue(STORAGE_KEYS.SETTINGS, {}) }
}

export function saveSettings(settings) {
  writeValue(STORAGE_KEYS.SETTINGS, settings)
  if (isOnline()) {
    apiClient
      .put('/api/settings', settings)
      .catch((err) => console.warn('Settings sync to backend failed (local copy is unaffected):', err))
  }
}

// Pulls this device's settings from Postgres (via the backend) so they
// follow the device across sessions. Falls back to the local copy if the
// backend is unreachable.
export async function syncSettingsFromBackend() {
  if (!isOnline()) return getSettings()
  try {
    const result = await apiClient.get('/api/settings')
    if (result?.settings) {
      const merged = { ...DEFAULT_SETTINGS, ...result.settings }
      writeValue(STORAGE_KEYS.SETTINGS, merged)
      return merged
    }
  } catch (err) {
    console.warn('Could not sync settings from backend, using local copy:', err)
  }
  return getSettings()
}

export function getKnowledgeBaseMeta() {
  return {
    cachedIssueCount: issues.length,
    lastSync: readValue(STORAGE_KEYS.KB_SYNC_TIME, '2026-08-24T06:00:00Z'),
  }
}

export function syncKnowledgeBase() {
  const now = new Date().toISOString()
  writeValue(STORAGE_KEYS.KB_SYNC_TIME, now)
  return now
}
