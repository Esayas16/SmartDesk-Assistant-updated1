// Wraps navigator.onLine with a manual simulation override so the demo
// "Connection Simulation" control in Settings can force offline/online mode
// regardless of the browser's real network state.

import { readValue, writeValue, STORAGE_KEYS } from './storageService'

const listeners = new Set()

function getSimulationMode() {
  // 'auto' | 'online' | 'offline'
  return readValue(STORAGE_KEYS.SIMULATION_MODE, 'auto')
}

export function setSimulationMode(mode) {
  writeValue(STORAGE_KEYS.SIMULATION_MODE, mode)
  notify()
}

export function isOnline() {
  const mode = getSimulationMode()
  if (mode === 'online') return true
  if (mode === 'offline') return false
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}

export function subscribe(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function notify() {
  const status = isOnline()
  listeners.forEach((cb) => cb(status))
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', notify)
  window.addEventListener('offline', notify)
}
