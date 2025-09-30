import { Router, type Request, type Response } from "express";
import multer from "multer";
import path from "path";

const router = Router();

// 📂 Configuració de multer (on guardarà els fitxers)
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, "../../uploads")); // guarda a /uploads
  },
  filename: function (_req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 🖼️ Endpoint POST per pujar imatges
router.post("/", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No s'ha pujat cap fitxer" });
  }

  // 👉 URL pública de l’arxiu
  const fileUrl = `/uploads/${req.file.filename}`;

  res.json({ url: fileUrl });
});

export default router;
