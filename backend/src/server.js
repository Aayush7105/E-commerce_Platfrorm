import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import { createRateLimiter } from './middleware/rateLimit.js'
import { createRequestLogger } from './middleware/requestLogger.js'
import productRoutes from './routes/productRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const PORT = Number(process.env.PORT) || 5000
let server
let isShuttingDown = false

const parseBooleanEnv = (value, fallback) => {
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return fallback

  const normalizedValue = value.trim().toLowerCase()
  if (normalizedValue === 'true') return true
  if (normalizedValue === 'false') return false
  return fallback
}

const parsePositiveIntegerEnv = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback
  }

  return parsedValue
}

const parseNonEmptyStringEnv = (value, fallback) => {
  if (typeof value !== 'string') {
    return fallback
  }

  const normalizedValue = value.trim()
  return normalizedValue || fallback
}

const RATE_LIMIT_WINDOW_MS = parsePositiveIntegerEnv(process.env.RATE_LIMIT_WINDOW_MS, 60_000)
const RATE_LIMIT_MAX_REQUESTS = parsePositiveIntegerEnv(process.env.RATE_LIMIT_MAX_REQUESTS, 120)
const SHOULD_ENABLE_REQUEST_LOGGING = parseBooleanEnv(
  process.env.REQUEST_LOGGING,
  process.env.NODE_ENV !== 'test',
)
const TRUST_PROXY = parseBooleanEnv(process.env.TRUST_PROXY, false)
const JSON_BODY_LIMIT = parseNonEmptyStringEnv(process.env.JSON_BODY_LIMIT, '100kb')
const URLENCODED_BODY_LIMIT = parseNonEmptyStringEnv(process.env.URLENCODED_BODY_LIMIT, '100kb')
const HEALTH_INCLUDE_UPTIME = parseBooleanEnv(process.env.HEALTH_INCLUDE_UPTIME, true)

const buildCorsOriginValidator = () => {
  const corsOrigin = process.env.CORS_ORIGIN

  if (!corsOrigin) {
    return true
  }

  const allowedOrigins = corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (!allowedOrigins.length) {
    return true
  }

  return (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error('CORS policy blocked this request'))
  }
}

const buildSecurityHeadersMiddleware = () => {
  return (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('Referrer-Policy', 'no-referrer')
    res.setHeader('X-DNS-Prefetch-Control', 'off')
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none')
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }

    next()
  }
}

const getDatabaseStateLabel = (readyState) => {
  const stateLabels = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }

  return stateLabels[readyState] || 'unknown'
}

app.set('trust proxy', TRUST_PROXY)
app.disable('x-powered-by')
app.use(cors({ origin: buildCorsOriginValidator() }))
app.use(buildSecurityHeadersMiddleware())
app.use(createRequestLogger({ enabled: SHOULD_ENABLE_REQUEST_LOGGING }))
app.use(
  createRateLimiter({
    windowMs: RATE_LIMIT_WINDOW_MS,
    maxRequests: RATE_LIMIT_MAX_REQUESTS,
    skip: (req) => req.path === '/api/health' || req.path === '/api/ready',
  }),
)
app.use(express.json({ limit: JSON_BODY_LIMIT }))
app.use(express.urlencoded({ extended: true, limit: URLENCODED_BODY_LIMIT }))

app.get('/api/health', (req, res) => {
  const readyState = mongoose.connection.readyState

  const healthResponse = {
    status: 'ok',
    message: 'Backend is running',
    service: 'ecommerce-backend',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: getDatabaseStateLabel(readyState),
  }

  if (HEALTH_INCLUDE_UPTIME) {
    healthResponse.uptimeSeconds = Number(process.uptime().toFixed(1))
  }

  res.status(200).json(healthResponse)
})

app.get('/api/ready', (req, res) => {
  const readyState = mongoose.connection.readyState
  const isDatabaseReady = readyState === 1

  res.status(isDatabaseReady ? 200 : 503).json({
    status: isDatabaseReady ? 'ready' : 'not_ready',
    database: getDatabaseStateLabel(readyState),
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/products', productRoutes)

app.use(notFound)
app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDB()
    server = app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Server startup failed:', error)
    process.exit(1)
  }
}

const shutdown = async (signal, exitCode = 0) => {
  if (isShuttingDown) {
    return
  }

  isShuttingDown = true
  console.log(`${signal} received. Shutting down gracefully...`)

  const forceExitTimer = setTimeout(() => {
    console.error('Forced shutdown: cleanup timed out')
    process.exit(1)
  }, 10000)
  forceExitTimer.unref()

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error)
            return
          }

          resolve()
        })
      })
      console.log('HTTP server closed')
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(false)
      console.log('MongoDB connection closed')
    }

    clearTimeout(forceExitTimer)
    process.exit(exitCode)
  } catch (error) {
    clearTimeout(forceExitTimer)
    console.error('Error during graceful shutdown:', error)
    process.exit(1)
  }
}

startServer()

process.on('SIGINT', () => {
  shutdown('SIGINT')
})

process.on('SIGTERM', () => {
  shutdown('SIGTERM')
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason)
  shutdown('unhandledRejection', 1)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
  shutdown('uncaughtException', 1)
})
