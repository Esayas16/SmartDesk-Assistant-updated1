// History and settings are scoped per browser/device (no login system in
// this prototype). The frontend's apiClient.js generates a random UUID on
// first use, stores it in localStorage, and sends it as X-Device-Id on
// every request - this just enforces that it's present.
export function deviceIdMiddleware(req, res, next) {
  const deviceId = req.header('x-device-id')
  if (!deviceId || typeof deviceId !== 'string') {
    return res.status(400).json({ error: 'X-Device-Id header is required' })
  }
  req.deviceId = deviceId
  next()
}
