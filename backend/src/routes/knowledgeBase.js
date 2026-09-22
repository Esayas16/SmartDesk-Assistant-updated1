import { Router } from 'express'
import { pool } from '../db/pool.js'

const router = Router()

// GET /api/categories
router.get('/categories', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, name, icon, description FROM categories ORDER BY name')
    res.json({ categories: rows })
  } catch (err) {
    next(err)
  }
})

// GET /api/issues?q=&category=&difficulty=&offlineOnly=true
router.get('/issues', async (req, res, next) => {
  try {
    const { q, category, difficulty, offlineOnly } = req.query
    const clauses = []
    const params = []

    if (category) {
      params.push(category)
      clauses.push(`category_id = $${params.length}`)
    }
    if (difficulty) {
      params.push(difficulty)
      clauses.push(`difficulty = $${params.length}`)
    }
    if (offlineOnly === 'true') {
      clauses.push('offline_available = true')
    }
    if (q) {
      params.push(`%${q.toLowerCase()}%`)
      const p = `$${params.length}`
      clauses.push(`(lower(title) LIKE ${p} OR lower(coalesce(description,'')) LIKE ${p} OR lower(symptoms::text) LIKE ${p})`)
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
    const { rows } = await pool.query(
      `SELECT id, category_id AS category, title, description, difficulty,
              estimated_time AS "estimatedTime", visual_guide AS "visualGuide",
              offline_available AS "offlineAvailable", symptoms, steps, solution
       FROM issues
       ${where}
       ORDER BY title`,
      params,
    )
    res.json({ issues: rows })
  } catch (err) {
    next(err)
  }
})

// GET /api/issues/:id
router.get('/issues/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, category_id AS category, title, description, difficulty,
              estimated_time AS "estimatedTime", visual_guide AS "visualGuide",
              offline_available AS "offlineAvailable", symptoms, steps, solution
       FROM issues WHERE id = $1`,
      [req.params.id],
    )
    if (!rows[0]) return res.status(404).json({ error: 'Issue not found' })
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

export default router
