// Thin fetch wrapper for the SmartDesk backend (Express + PostgreSQL).
// The app stays offline-first: every call here is meant to be used
// best-effort by the other services (they already keep localStorage as
// the source of truth and fall back to it if these calls fail or time out).

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const DEVICE_ID_KEY = 'smartdesk:device_id'

// A stable, anonymous per-browser id so history/settings can sync across
// sessions on the same device without requiring a login system.
export function getDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id =
      (typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID()) ||
      `device-${Date.now()}-${Math.random().toString(16).slice(2)}`
    localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

async function request(path, { method = 'GET', body, timeoutMs = 6000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'content-type': 'application/json',
        'x-device-id': getDeviceId(),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    if (!res.ok) {
      throw new Error(`${method} ${path} failed with status ${res.status}`)
    }
    if (res.status === 204) return null
    return res.json()
  } finally {
    clearTimeout(timer)
  }
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body, options = {}) => request(path, { method: 'POST', body, ...options }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
  getDeviceId,
}
