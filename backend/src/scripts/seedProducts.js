import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from '../config/db.js'
import Product from '../models/Product.js'
import seedProducts from '../data/seedProducts.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const run = async () => {
  try {
    await connectDB()

    if (process.argv.includes('--clear')) {
      await Product.deleteMany({})
      console.log('Products cleared')
      process.exit(0)
    }

    await Product.deleteMany({})
    await Product.insertMany(seedProducts)
    console.log('Products seeded successfully')
    process.exit(0)
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`)
    process.exit(1)
  }
}

run()
