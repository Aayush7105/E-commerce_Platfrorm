import mongoose from 'mongoose'

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Add it in backend/.env')
  }

  try {
    await mongoose.connect(mongoUri)
    console.log(`MongoDB connected: ${mongoose.connection.host}`)
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
