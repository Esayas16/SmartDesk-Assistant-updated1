// Lightweight localStorage-backed persistence layer.
// Stands in for IndexedDB in this prototype - the API shape (namespaced keys,
// JSON serialization) is deliberately similar so it can be swapped for a real
// IndexedDB wrapper without touching calling code.

const PREFIX = 'smartdesk:'

export function readValue(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.error(`storageService: failed to read "${key}"`, err)
    return fallback
  }
}

export function writeValue(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch (err) {
    console.error(`storageService: failed to write "${key}"`, err)
    return false
  }
}

export function removeValue(key) {
  localStorage.removeItem(PREFIX + key)
}

export const STORAGE_KEYS = {
  HISTORY: 'history',
  SETTINGS: 'settings',
  SIMULATION_MODE: 'simulation_mode',
  KB_SYNC_TIME: 'kb_sync_time',
  SYNC_QUEUE: 'sync_queue',
}
