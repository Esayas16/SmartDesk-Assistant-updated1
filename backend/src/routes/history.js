import { Router } from 'express'
import { pool } from '../db/pool.js'

const router = Router()

// All routes here run behind deviceIdMiddleware (mounted in server.js),
// so req.deviceId is always set.

// GET /api/history
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, issue_id AS "issueId", issue_title AS "issueTitle", category,
              result, duration_sec AS "durationSec", mode, created_at AS date
       FROM history
       WHERE device_id = $1
       ORDER BY created_at DESC
       LIMIT 200`,
      [req.deviceId],
    )
    res.json({ history: rows })
  } catch (err) {
    next(err)
  }
})

// POST /api/history  { entries: [...] }
// The frontend's historyService.js keeps localStorage as the source of
// truth and pushes its full current list here after every change - this
// replaces the device's entire remote history with that list, so it's a
// last-write-wins sync rather than an append.
router.post('/', async (req, res, next) => {
  const { entries } = req.body || {}
  if (!Array.isArray(entries)) {
    return res.status(400).json({ error: 'entries must be an array' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('DELETE FROM history WHERE device_id = $1', [req.deviceId])

    for (const e of entries) {
      if (!e || typeof e.issueTitle !== 'string') continue
      await client.query(
        `INSERT INTO history (device_id, issue_id, issue_title, category, result, duration_sec, mode, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8::timestamptz, now()))`,
        [
          req.deviceId,
          e.issueId ?? null,
          e.issueTitle,
          e.category ?? null,
          e.result ?? null,
          Number.isFinite(e.durationSec) ? e.durationSec : null,
          e.mode ?? null,
          e.date ?? null,
        ],
      )
    }

    await client.query('COMMIT')
    res.status(204).end()
  } catch (err) {
    await client.query('ROLLBACK')
    next(err)
  } finally {
    client.release()
  }
})

// DELETE /api/history/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM history WHERE device_id = $1 AND id = $2', [req.deviceId, req.params.id])
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

// DELETE /api/history
router.delete('/', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM history WHERE device_id = $1', [req.deviceId])
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

export default router
