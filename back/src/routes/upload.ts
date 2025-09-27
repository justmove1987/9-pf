import { Router, type Request, type Response, type NextFunction } from "express";
import { upload } from "../middleware/upload.ts";
import jwt from "jsonwebtoken";

const router = Router();

// Middleware para validar token
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token requerit" });

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) return res.status(401).json({ message: "Format invàlid" });

  try {
    jwt.verify(token, process.env.JWT_SECRET || "secret");
    next();
  } catch {
    return res.status(401).json({ message: "Token invàlid" });
  }
}

// ✅ Endpoint que usa CKEditor para subir imágenes
router.post("/", upload.single("upload"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});


export default router;
