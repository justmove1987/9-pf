import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";

import authRoutes from "./routes/auth.ts";
import adminRoutes from "./routes/admin.ts";
import userRoutes from "./routes/user.ts";
import projectsRoutes from "./routes/projects.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ------------------------------------------------------------------
   🔑 Middlewares globals
------------------------------------------------------------------- */
app.use(
  cors({
    origin: [
      "http://localhost:5173",              // desenvolupament
      "https://inprocode-frontend.vercel.app", // producció
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

/* ------------------------------------------------------------------
   📂 Servir imatges pujades
------------------------------------------------------------------- */
const uploadDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadDir));

/* ------------------------------------------------------------------
   📸 Endpoint per pujar imatges
------------------------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});
const upload = multer({ storage });

app.post("/uploads", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file received" });
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

/* ------------------------------------------------------------------
   🔗 Rutes existents
------------------------------------------------------------------- */
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/projects", projectsRoutes);

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
