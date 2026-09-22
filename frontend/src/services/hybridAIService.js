// hybridAIService
//
// Routing logic:
//   IF internet is unavailable        -> use the offline rule engine
//   ELSE ask the real AI (backend -> Claude), passing the conversation so far
//        IF the backend/AI is unreachable or not configured
//                                     -> fall back to the offline knowledge base
//                                        (or a generic mock reply)
//
// The API key never lives in the browser: the frontend only talks to the
// SmartDesk backend (see backend/src/routes/ai.js), which calls Claude.

import { isOnline } from './connectivityService'
import { issues, getIssue } from '../data/issues'
import { searchOfflineKnowledge } from './knowledgeBaseService'
import { apiClient } from './apiClient'

export { isOnline }

// Real AI replies can take several seconds, so this is longer than the
// default timeout used for quick sync calls.
const AI_TIMEOUT_MS = 30000

export function searchOfflineKnowledgeBase(query) {
  return searchOfflineKnowledge(query)
}

export function runOfflineDiagnosis(issueId) {
  const issue = getIssue(issueId)
  if (!issue) return null
  return {
    source: 'offline-rule-engine',
    issue,
    steps: issue.steps,
  }
}

function matchKnownIssue(message) {
  const q = message.toLowerCase()
  return issues.find((issue) =>
    issue.title.toLowerCase().split(' ').some((word) => word.length > 3 && q.includes(word)) ||
    (issue.symptoms || []).some((s) => q.includes(s.toLowerCase().slice(0, 12)))
  )
}

// Reports whether a live model is connected: 'live' (Claude answering),
// 'mock' (backend up but no API key), or 'unreachable' (no backend).
export async function getAIStatus() {
  try {
    const health = await apiClient.get('/api/health')
    return health?.ai === 'live' ? 'live' : 'mock'
  } catch {
    return 'unreachable'
  }
}

// Calls the backend AI. Returns the result, or null if the backend could not
// be reached (so callers can fall back to local behaviour).
async function callBackendAI(message, history, context) {
  try {
    return await apiClient.post('/api/ai/ask', { message, history, context }, { timeoutMs: AI_TIMEOUT_MS })
  } catch (err) {
    console.warn('SmartDesk AI backend unavailable, falling back to local answers:', err)
    return null
  }
}

async function localMockCloudAI(message) {
  await new Promise((resolve) => setTimeout(resolve, 900))
  const matched = matchKnownIssue(message)

  return {
    source: 'mock-cloud-ai',
    isMock: true,
    reply: matched
      ? `Let's diagnose this step by step. This sounds similar to "${matched.title}." I'd start by checking IP configuration, then test gateway connectivity, DNS resolution, and finally external connectivity.`
      : `Let's diagnose this step by step. Based on what you've described, I'd recommend confirming basic connectivity first, then narrowing down whether the issue is hardware, driver, or configuration related.`,
    suggestedSteps: matched
      ? matched.steps.slice(0, 4).map((s) => s.title)
      : ['Check IP configuration', 'Test gateway connectivity', 'Test DNS', 'Test external connectivity'],
    relatedIssueId: matched?.id ?? null,
  }
}

// Cloud AI: real backend first, local mock only if the backend is unreachable.
export async function askCloudAI(message, context = {}, history = []) {
  const result = await callBackendAI(message, history, context)
  return result || localMockCloudAI(message)
}

// Returns 'offline-rule-engine' or 'cloud-ai' without invoking anything -
// useful for UI to preview the route.
export function previewRoute() {
  return isOnline() ? 'cloud-ai' : 'offline-rule-engine'
}

// `history` is the conversation so far, as [{ role: 'user'|'assistant', content }].
export async function routeDiagnosticRequest(message, history = []) {
  if (!isOnline()) {
    const matched = matchKnownIssue(message)
    return {
      source: 'offline-rule-engine',
      reply: matched
        ? `You're offline, so I'm using the local rule engine. This matches "${matched.title}" in the cached knowledge base.`
        : `You're offline, so I'm using the local rule engine. I couldn't find an exact match, but here's a general checklist to try.`,
      suggestedSteps: matched
        ? matched.steps.slice(0, 4).map((s) => s.title)
        : ['Check physical connections', 'Restart the affected device', 'Check for obvious error messages'],
      relatedIssueId: matched?.id ?? null,
    }
  }

  const ai = await callBackendAI(message, history, {})

  // A real model answered - use it as-is.
  if (ai && !ai.isMock) return ai

  // No live model (backend down, or running without an API key): prefer a
  // matching knowledge-base article over a generic canned reply.
  const matched = matchKnownIssue(message)
  if (matched) {
    return {
      source: 'offline-knowledge-base',
      reply: `I found a matching article in the knowledge base: "${matched.title}." Here's a quick summary before we go further.`,
      suggestedSteps: matched.steps.slice(0, 4).map((s) => s.title),
      relatedIssueId: matched.id,
    }
  }

  return ai || localMockCloudAI(message)
}
