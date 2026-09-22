import { Router } from 'express'
import { pool } from '../db/pool.js'

const router = Router()

// Mirrors frontend/src/services/settingsService.js's DEFAULT_SETTINGS.
const DEFAULTS = {
  theme: 'dark',
  automaticDiagnostics: true,
  saveHistory: true,
  onlineAIEnabled: true,
  offlineFallbackEnabled: true,
}

// GET /api/settings
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM settings WHERE device_id = $1', [req.deviceId])
    if (!rows[0]) return res.json({ settings: DEFAULTS })

    const row = rows[0]
    res.json({
      settings: {
        theme: row.theme,
        automaticDiagnostics: row.automatic_diagnostics,
        saveHistory: row.save_history,
        onlineAIEnabled: row.online_ai_enabled,
        offlineFallbackEnabled: row.offline_fallback_enabled,
      },
    })
  } catch (err) {
    next(err)
  }
})

// PUT /api/settings  { theme, automaticDiagnostics, saveHistory, onlineAIEnabled, offlineFallbackEnabled }
router.put('/', async (req, res, next) => {
  try {
    const s = { ...DEFAULTS, ...(req.body || {}) }
    await pool.query(
      `INSERT INTO settings (device_id, theme, automatic_diagnostics, save_history, online_ai_enabled, offline_fallback_enabled, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, now())
       ON CONFLICT (device_id) DO UPDATE SET
         theme = EXCLUDED.theme,
         automatic_diagnostics = EXCLUDED.automatic_diagnostics,
         save_history = EXCLUDED.save_history,
         online_ai_enabled = EXCLUDED.online_ai_enabled,
         offline_fallback_enabled = EXCLUDED.offline_fallback_enabled,
         updated_at = now()`,
      [req.deviceId, s.theme, !!s.automaticDiagnostics, !!s.saveHistory, !!s.onlineAIEnabled, !!s.offlineFallbackEnabled],
    )
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

export default router
