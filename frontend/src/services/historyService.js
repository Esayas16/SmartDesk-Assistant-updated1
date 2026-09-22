import { readValue, writeValue, STORAGE_KEYS } from './storageService'
import { apiClient } from './apiClient'
import { isOnline } from './connectivityService'

const SEED_HISTORY = [
  { id: 'h1', date: '2026-08-25T09:12:00Z', issueTitle: 'No Internet Connection', category: 'Network', result: 'Resolved', durationSec: 272, mode: 'Offline' },
  { id: 'h2', date: '2026-08-24T15:40:00Z', issueTitle: 'Printer Shows Offline', category: 'Printer', result: 'Resolved', durationSec: 198, mode: 'Offline' },
  { id: 'h3', date: '2026-08-23T11:05:00Z', issueTitle: 'VPN Connection Failed', category: 'Network', result: 'Escalated', durationSec: 410, mode: 'Online' },
  { id: 'h4', date: '2026-08-21T08:22:00Z', issueTitle: 'Slow Internet', category: 'Network', result: 'Resolved', durationSec: 165, mode: 'Offline' },
  { id: 'h5', date: '2026-08-19T14:50:00Z', issueTitle: 'Webcam Not Detected', category: 'Peripheral', result: 'Resolved', durationSec: 224, mode: 'Online' },
]

export function getHistory() {
  return readValue(STORAGE_KEYS.HISTORY, SEED_HISTORY)
}

// Best-effort, fire-and-forget sync to the backend. localStorage stays the
// source of truth for the UI, so a failed/slow request here never blocks
// or breaks the offline-first experience.
function pushToBackend(entries) {
  if (!isOnline()) return
  apiClient
    .post('/api/history', {
      entries: entries.map((e) => ({
        issueId: e.issueId ?? null,
        issueTitle: e.issueTitle,
        category: e.category,
        result: e.result,
        durationSec: e.durationSec,
        mode: e.mode,
        date: e.date,
      })),
    })
    .catch((err) => console.warn('History sync to backend failed (local copy is unaffected):', err))
}

export function addHistoryEntry(entry) {
  const current = getHistory()
  const next = [{ id: `h${Date.now()}`, date: new Date().toISOString(), ...entry }, ...current]
  writeValue(STORAGE_KEYS.HISTORY, next)
  pushToBackend(next)
  return next
}

export function deleteHistoryEntry(id) {
  const next = getHistory().filter((h) => h.id !== id)
  writeValue(STORAGE_KEYS.HISTORY, next)
  pushToBackend(next)
  return next
}

export function clearHistory() {
  writeValue(STORAGE_KEYS.HISTORY, [])
  pushToBackend([])
}

// Pulls this device's history from Postgres (via the backend) and makes it
// the local copy - used on page load so history syncs across sessions.
// Falls back silently to whatever is already in localStorage if the
// backend is unreachable or has nothing for this device yet.
export async function syncHistoryFromBackend() {
  if (!isOnline()) return getHistory()
  try {
    const result = await apiClient.get('/api/history')
    if (result?.history) {
      const mapped = result.history.map((h) => ({
        id: h.id,
        date: h.date,
        issueId: h.issueId,
        issueTitle: h.issueTitle,
        category: h.category,
        result: h.result,
        durationSec: h.durationSec,
        mode: h.mode,
      }))
      if (mapped.length) writeValue(STORAGE_KEYS.HISTORY, mapped)
      return mapped.length ? mapped : getHistory()
    }
  } catch (err) {
    console.warn('Could not sync history from backend, using local copy:', err)
  }
  return getHistory()
}

export function formatDuration(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${s.toString().padStart(2, '0')}s`
}
