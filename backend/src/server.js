import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import aiRouter from './routes/ai.js'
import historyRouter from './routes/history.js'
import settingsRouter from './routes/settings.js'
import knowledgeBaseRouter from './routes/knowledgeBase.js'
import { deviceIdMiddleware } from './middleware/deviceId.js'
import { pool } from './db/pool.js'

const app = express()
const PORT = process.env.PORT || 4000
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: allowedOrigins,
  }),
)
app.use(express.json())

app.get('/api/health', async (req, res) => {
  let db = 'unreachable'
  try {
    await pool.query('SELECT 1')
    db = 'ok'
  } catch (err) {
    console.error('Health check: database unreachable:', err.message)
  }
  res.json({
    status: 'ok',
    service: 'smartdesk-backend',
    db,
    ai: process.env.ANTHROPIC_API_KEY ? 'live' : 'mock',
    time: new Date().toISOString(),
  })
})

app.use('/api/ai', aiRouter)
app.use('/api/history', deviceIdMiddleware, historyRouter)
app.use('/api/settings', deviceIdMiddleware, settingsRouter)
app.use('/api', knowledgeBaseRouter) // GET /api/categories, /api/issues, /api/issues/:id

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`SmartDesk backend listening on http://localhost:${PORT}`)
})
