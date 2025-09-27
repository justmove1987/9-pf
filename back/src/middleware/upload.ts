// src/middleware/upload.ts
import multer from "multer";
import path from "path";
import type { Request } from "express";
// 👇 amb verbatimModuleSyntax actiu, els tipus han d’anar amb import type
import type { FileFilterCallback } from "multer";

// carpeta on es guardaran les imatges
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/"); // recorda que aquesta carpeta existeixi a l’arrel del projecte
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// només permet imatges
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images allowed"));
};

export const upload = multer({ storage, fileFilter });
