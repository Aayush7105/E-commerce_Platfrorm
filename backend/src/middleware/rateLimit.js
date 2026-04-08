const getClientKey = (req) => req.ip || req.socket?.remoteAddress || 'unknown'

export const createRateLimiter = ({ windowMs = 60_000, maxRequests = 120, skip } = {}) => {
  const requestsByClient = new Map()

  return (req, res, next) => {
    if (typeof skip === 'function' && skip(req)) {
      next()
      return
    }

    const now = Date.now()
    const clientKey = getClientKey(req)
    const windowStartedAt = now - windowMs

    if (requestsByClient.size > 5_000) {
      for (const [key, requestState] of requestsByClient.entries()) {
        if (requestState.windowStart < windowStartedAt) {
          requestsByClient.delete(key)
        }
      }
    }

    const requestState = requestsByClient.get(clientKey)

    if (!requestState || requestState.windowStart < windowStartedAt) {
      requestsByClient.set(clientKey, { count: 1, windowStart: now })
      res.setHeader('X-RateLimit-Limit', String(maxRequests))
      res.setHeader('X-RateLimit-Remaining', String(Math.max(maxRequests - 1, 0)))
      res.setHeader('X-RateLimit-Reset', String(Math.ceil(windowMs / 1000)))
      next()
      return
    }

    requestState.count += 1

    const retryAfterSeconds = Math.max(
      Math.ceil((requestState.windowStart + windowMs - now) / 1000),
      1,
    )
    const remainingRequests = Math.max(maxRequests - requestState.count, 0)

    res.setHeader('X-RateLimit-Limit', String(maxRequests))
    res.setHeader('X-RateLimit-Remaining', String(remainingRequests))
    res.setHeader('X-RateLimit-Reset', String(retryAfterSeconds))

    if (requestState.count > maxRequests) {
      res.setHeader('Retry-After', String(retryAfterSeconds))
      res.status(429).json({ message: 'Too many requests. Please try again soon.' })
      return
    }

    next()
  }
}
