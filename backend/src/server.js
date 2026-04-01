import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
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

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Backend is running' })
})

app.use('/api/products', productRoutes)

app.use(notFound)
app.use(errorHandler)

const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`)
  })
}

startServer()
