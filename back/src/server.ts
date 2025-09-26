import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.ts";
import adminRoutes from "./routes/admin.ts";
import userRoutes from "./routes/user.ts";
import projectsRoutes from "./routes/projects.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware per parsejar JSON — ha d'anar abans de les rutes
app.use(express.json());

// Permetre sol·licituds des del frontend
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://inprocode-frontend.vercel.app'
    ],
    credentials: true,
  })
);

// ✅ Registre de rutes després dels middlewares
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/projects", projectsRoutes);

// Ruta de prova
app.get('/', (_req, res) => {
  res.send('Servidor Express en funcionament!');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Servidor escoltant al port ${PORT}`);
  });
}

export default app;
