export const createRequestLogger = ({ enabled = true } = {}) => {
  if (!enabled) {
    return (_req, _res, next) => next()
  }

  return (req, res, next) => {
    const startTime = process.hrtime.bigint()

    res.on('finish', () => {
      const elapsedTimeInMs = Number(process.hrtime.bigint() - startTime) / 1e6
      const duration = elapsedTimeInMs.toFixed(1)
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
      )
    })

    next()
  }
}
