import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import productRoutes from './routes/productRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const PORT = Number(process.env.PORT) || 5000
let server
let isShuttingDown = false

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

app.disable('x-powered-by')
app.use(cors({ origin: buildCorsOriginValidator() }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Backend is running' })
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
