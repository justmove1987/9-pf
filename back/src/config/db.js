import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connexió amb MongoDB establerta')
  } catch (error) {
    console.error('❌ Error connectant amb MongoDB:', error)
    process.exit(1)
  }
}

export default connectDB