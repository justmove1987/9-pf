import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.ts";
import adminRoutes from "./routes/admin.ts";
import userRoutes from "./routes/user.ts";
import projectsRoutes from "./routes/projects.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ------------------------------------------------------------------
   🔑 Middlewares globales
------------------------------------------------------------------- */
// 1️⃣  Habilitar CORS **antes** de registrar rutas
app.use(
  cors({
    origin: [
      "http://localhost:5173",              // desarrollo
      "https://inprocode-frontend.vercel.app", // producción
    ],
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
  })
);

// 2️⃣  Aumentar el límite del body para subir imágenes grandes
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

/* ------------------------------------------------------------------
   🔗 Rutas
------------------------------------------------------------------- */
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/projects", projectsRoutes);

// Ruta simple de prueba
app.get("/", (_req, res) => {
  res.send("Servidor Express en funcionament!");
});

/* ------------------------------------------------------------------
   🚀 Iniciar servidor
------------------------------------------------------------------- */
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`✅ Servidor escoltant al port ${PORT}`);
  });
}

export default app;
