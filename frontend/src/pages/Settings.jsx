import { useState } from 'react'
import { Sun, Moon, RefreshCw, ShieldCheck } from 'lucide-react'
import { useApp } from '../hooks/AppContext'
import { useToast } from '../hooks/useToast'
import { getKnowledgeBaseMeta, syncKnowledgeBase } from '../services/settingsService'
import Toggle from '../components/Toggle'

function SettingsSection({ title, children }) {
  return (
    <div className="rounded-xl border border-line bg-panel/60 p-5">
      <h3 className="font-display text-sm font-semibold text-text mb-1">{title}</h3>
      <div className="divide-y divide-line-soft">{children}</div>
    </div>
  )
}

export default function Settings() {
  const { settings, updateSettings, simulationMode, setSimulationMode } = useApp()
  const { showToast } = useToast()
  const [kbMeta, setKbMeta] = useState(getKnowledgeBaseMeta())

  const handleSync = () => {
    const now = syncKnowledgeBase()
    setKbMeta((m) => ({ ...m, lastSync: now }))
    showToast('Offline knowledge base synchronized.', 'success')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-text">Settings</h2>
        <p className="text-text-dim text-sm mt-1">Configure SmartDesk Assistant to fit how you work.</p>
      </div>

      <SettingsSection title="Appearance">
        <div className="flex gap-3 py-3">
          {[{ id: 'dark', label: 'Dark Mode', icon: Moon }, { id: 'light', label: 'Light Mode', icon: Sun }].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => updateSettings({ theme: id })}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm transition-colors ${
                settings.theme === id ? 'border-cyan/40 bg-cyan/10 text-cyan' : 'border-line text-text-dim hover:text-text'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Diagnostics">
        <Toggle
          id="auto-diag"
          checked={settings.automaticDiagnostics}
          onChange={(v) => updateSettings({ automaticDiagnostics: v })}
          label="Automatic Diagnostics"
          description="Run a quick diagnostic snapshot whenever you open the app."
        />
        <Toggle
          id="save-history"
          checked={settings.saveHistory}
          onChange={(v) => updateSettings({ saveHistory: v })}
          label="Save Diagnostic History"
          description="Store completed sessions in your local history log."
        />
      </SettingsSection>

      <SettingsSection title="AI">
        <Toggle
          id="online-ai"
          checked={settings.onlineAIEnabled}
          onChange={(v) => updateSettings({ onlineAIEnabled: v })}
          label="Online AI Enabled"
          description="Allow complex questions to be routed to the cloud AI service."
        />
        <Toggle
          id="offline-fallback"
          checked={settings.offlineFallbackEnabled}
          onChange={(v) => updateSettings({ offlineFallbackEnabled: v })}
          label="Offline Fallback Enabled"
          description="Use the local rule engine automatically when the network is unavailable."
        />
      </SettingsSection>

      <SettingsSection title="Offline Knowledge Base">
        <div className="py-3 flex items-center justify-between text-sm">
          <span className="text-text-dim">Cached Issues</span>
          <span className="text-text font-mono">{kbMeta.cachedIssueCount}</span>
        </div>
        <div className="py-3 flex items-center justify-between text-sm">
          <span className="text-text-dim">Last Synchronization</span>
          <span className="text-text font-mono text-xs">{new Date(kbMeta.lastSync).toLocaleString()}</span>
        </div>
        <div className="py-3">
          <button
            onClick={handleSync}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 text-cyan text-xs font-mono uppercase tracking-wider px-4 py-2.5 hover:bg-cyan/20 transition-colors"
          >
            <RefreshCw size={13} /> Sync Knowledge Base
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Connection Simulation">
        <div className="py-3">
          <p className="text-xs text-text-dim mb-3">Developer control for demoing offline behavior.</p>
          <div className="flex gap-2">
            {['auto', 'online', 'offline'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSimulationMode(mode)}
                className={`flex-1 rounded-lg border py-2.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                  simulationMode === mode ? 'border-cyan/40 bg-cyan/10 text-cyan' : 'border-line text-text-dim hover:text-text'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Privacy">
        <div className="py-3 flex gap-3">
          <ShieldCheck size={16} className="text-cyan shrink-0 mt-0.5" />
          <p className="text-xs text-text-dim leading-relaxed">
            Diagnostic logs are stored locally on this device and should not contain unnecessary personal
            information. Avoid entering sensitive personal data into troubleshooting notes or the AI assistant chat.
          </p>
        </div>
      </SettingsSection>
    </div>
  )
}
