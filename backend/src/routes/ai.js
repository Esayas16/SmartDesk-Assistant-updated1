import { Router } from 'express'
import { pool } from '../db/pool.js'

const router = Router()

const ANTHROPIC_URL = process.env.ANTHROPIC_API_URL || 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-sonnet-5'
const UPSTREAM_TIMEOUT_MS = 25000
const MAX_HISTORY_MESSAGES = 10
const MAX_MESSAGE_CHARS = 2000

const SYSTEM_PROMPT = `You are SmartDesk Assistant, a friendly and practical IT support helper for a first-line help desk.

How to answer:
- Give clear, step-by-step troubleshooting that a non-technical person can follow.
- Keep answers short: a one-line diagnosis, then 3-6 numbered steps. Use **bold** for key terms and \`code\` for commands or settings.
- Start with the safest, easiest fixes (restart, cables, settings) before advanced ones.
- If the problem is unclear, ask ONE short clarifying question instead of guessing.
- Never ask the user for passwords or recovery keys. Warn before anything that could delete data.
- If it looks like failing hardware, a security incident, or something risky, tell the user to escalate to a technician.
- Reply in the same language the user writes in.`

// Looks for an issue whose title shares a meaningful word with the
// message - the same lightweight heuristic the frontend's hybridAIService.js
// uses offline. Best-effort: if the database is down this returns null so
// the AI can still answer without grounding.
async function findMatchingIssue(message) {
  try {
    const words = message
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^a-z0-9-]/g, ''))
      .filter((w) => w.length > 3)
      .slice(0, 8)

    if (!words.length) return null

    const clauses = words.map((_, i) => `lower(title) LIKE $${i + 1}`).join(' OR ')
    const { rows } = await pool.query(
      `SELECT id, category_id AS category, title, steps
       FROM issues
       WHERE ${clauses}
       LIMIT 1`,
      words.map((w) => `%${w}%`),
    )
    return rows[0] || null
  } catch (err) {
    console.warn('Knowledge-base lookup skipped:', err.message)
    return null
  }
}

function logConversation({ deviceId, message, result }) {
  pool
    .query(
      `INSERT INTO ai_conversations (device_id, message, reply, source, related_issue_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [deviceId || null, message, result.reply, result.source, result.relatedIssueId],
    )
    .catch((err) => console.error('Failed to log AI conversation:', err.message))
}

// Turns the client-supplied history into a valid Anthropic `messages` array:
// only user/assistant turns, trimmed, capped, and starting with a user turn.
function buildMessages(history, message, context) {
  const cleaned = (Array.isArray(history) ? history : [])
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim(),
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_MESSAGE_CHARS) }))

  while (cleaned.length && cleaned[0].role !== 'user') cleaned.shift()

  const hasContext = context && typeof context === 'object' && Object.keys(context).length > 0
  const current = hasContext
    ? `${message}\n\n(Context: ${JSON.stringify(context).slice(0, 500)})`
    : message

  return [...cleaned, { role: 'user', content: current.slice(0, MAX_MESSAGE_CHARS + 600) }]
}

function mockResult(matched) {
  return {
    source: 'mock-cloud-ai',
    isMock: true,
    reply: matched
      ? `Let's diagnose this step by step. This sounds similar to "${matched.title}." I'd start by working through that issue's recorded troubleshooting steps.`
      : "Let's diagnose this step by step. Based on what you've described, I'd recommend confirming basic connectivity first, then narrowing down whether the issue is hardware, driver, or configuration related.",
    suggestedSteps: matched
      ? (matched.steps || []).slice(0, 4).map((s) => s.title)
      : ['Check IP configuration', 'Test gateway connectivity', 'Test DNS', 'Test external connectivity'],
    relatedIssueId: matched?.id ?? null,
  }
}

// GET /api/ai/status - lets the frontend show whether a live model is connected.
router.get('/status', (req, res) => {
  const live = Boolean(process.env.ANTHROPIC_API_KEY)
  res.json({ ai: live ? 'live' : 'mock', model: live ? process.env.ANTHROPIC_MODEL || DEFAULT_MODEL : null })
})

// Contract mirrors the frontend's src/services/hybridAIService.js
// askCloudAI(): { source, isMock, reply, suggestedSteps, relatedIssueId }.
// Body: { message, history?: [{ role, content }], context? }
router.post('/ask', async (req, res, next) => {
  const { message, history, context } = req.body || {}

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' })
  }
  const trimmed = message.trim().slice(0, MAX_MESSAGE_CHARS)

  try {
    const matched = await findMatchingIssue(trimmed)
    const apiKey = process.env.ANTHROPIC_API_KEY
    let result

    if (!apiKey) {
      // No key configured: keep the app working in development, grounded in
      // the real knowledge base instead of a static string.
      result = mockResult(matched)
    } else {
      const grounding = matched
        ? `A similar issue exists in the knowledge base: "${matched.title}" with these steps: ${(matched.steps || [])
            .map((s) => s.title)
            .join(', ')}. Use it as a reference when relevant, but answer the user's actual question.`
        : 'No closely matching issue was found in the knowledge base - answer from general first-line IT support knowledge.'

      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

      let response
      try {
        response = await fetch(ANTHROPIC_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
            max_tokens: 700,
            system: `${SYSTEM_PROMPT}\n\n${grounding}`,
            messages: buildMessages(history, trimmed, context),
          }),
          signal: controller.signal,
        })
      } finally {
        clearTimeout(timer)
      }

      if (!response.ok) {
        const detail = await response.text()
        console.error(`Anthropic API error ${response.status}:`, detail)
        return res.status(502).json({ error: 'Upstream AI request failed' })
      }

      const data = await response.json()
      const reply = (data.content || [])
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        .trim()

      if (!reply) {
        return res.status(502).json({ error: 'Upstream AI returned an empty reply' })
      }

      result = {
        source: 'cloud-ai',
        isMock: false,
        reply,
        suggestedSteps: [],
        relatedIssueId: matched?.id ?? null,
      }
    }

    logConversation({ deviceId: req.header('x-device-id'), message: trimmed, result })
    res.json(result)
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('Anthropic API request timed out')
      return res.status(504).json({ error: 'AI request timed out' })
    }
    next(err)
  }
})

export default router
