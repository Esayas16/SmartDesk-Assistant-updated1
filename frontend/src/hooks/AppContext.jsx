import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { isOnline as checkOnline, subscribe, setSimulationMode as setSimMode } from '../services/connectivityService'
import { readValue, STORAGE_KEYS } from '../services/storageService'
import { getSettings, saveSettings, syncSettingsFromBackend } from '../services/settingsService'
import { useToast } from './useToast'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [online, setOnline] = useState(checkOnline())
  const [simulationMode, setSimulationModeState] = useState(() => readValue(STORAGE_KEYS.SIMULATION_MODE, 'auto'))
  const [settings, setSettings] = useState(getSettings())
  const { showToast } = useToast()

  useEffect(() => {
    const unsubscribe = subscribe((status) => setOnline(status))
    return unsubscribe
  }, [])

  // Best-effort pull of this device's settings from the backend on load,
  // so they follow the device across sessions/browsers once a backend is
  // connected. Silently keeps the local copy if the backend isn't reachable.
  useEffect(() => {
    let cancelled = false
    syncSettingsFromBackend().then((remote) => {
      if (!cancelled) setSettings(remote)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Reflect the current theme onto <html data-theme="..."> so the CSS
  // variable overrides in index.css (light theme) actually take effect.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme)
  }, [settings.theme])

  const setSimulationMode = useCallback((mode) => {
    setSimMode(mode)
    setSimulationModeState(mode)
    setOnline(checkOnline())
    if (mode === 'offline') {
      showToast('You are offline. SmartDesk is using the local troubleshooting knowledge base.', 'warning')
    } else if (mode === 'online') {
      showToast('You are back online. Cloud AI and live sync are available.', 'success')
    } else {
      showToast('Connection simulation set to automatic.', 'info')
    }
  }, [showToast])

  const updateSettings = useCallback((partial) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial }
      saveSettings(next)
      return next
    })
  }, [])

  return (
    <AppContext.Provider value={{ online, simulationMode, setSimulationMode, settings, updateSettings }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
