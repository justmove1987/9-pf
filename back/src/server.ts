import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.ts";
import adminRoutes from "./routes/admin.ts";
import userRoutes from "./routes/user.ts";

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;

// Permitir solicitudes desde tu frontend
app.use(
  cors({
    origin: [
      'http://localhost:5173',            // desarrollo
      'https://inprocode-frontend.vercel.app' // prod (cambia si usas otro dominio)
    ],
    credentials: true
  })
);
app.use("/user", userRoutes);
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

// Ruta simple para comprobar que el servidor responde
app.get('/', (req, res) => {
  res.send('Servidor Express en funcionament!')
});

// Iniciar el servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Servidor escoltant al port ${PORT}`)
  });
} 

export default app