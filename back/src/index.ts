import dotenv from 'dotenv'
import connectDB from './config/db.ts';
import app from './server.ts';


dotenv.config()

if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      const PORT = process.env.PORT || 3000
      app.listen(PORT, () => {
        console.log(`✅ Servidor escoltant al port ${PORT}`)
      })
    })
    .catch((err) => {
      console.error('❌ Error connectant a MongoDB:', err)
    })
}