import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.ts";

const router = Router();

/** Middleware per validar el token JWT i afegir userId i role a req */
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Token requerit" });

  const parts = auth.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ message: "Format de token invàlid" });
  }

  const token: string = parts[1] || "";
  const secret: string = process.env.JWT_SECRET || "secret";

  try {
    const payload = jwt.verify(token, secret) as any;
    (req as any).userId = payload.id;
    (req as any).userRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ message: "Token invàlid" });
  }
}

/** ✅ Nova ruta: obtenir tots els usuaris (només editors o admins) */
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const role = (req as any).userRole;
    if (role !== "admin" && role !== "editor") {
      return res.status(403).json({ message: "Només editors o admins poden veure usuaris" });
    }

    const users = await User.find({}, "_id name role email").sort({ name: 1 });
    res.json(users);
  } catch (err) {
    console.error("Error obtenint usuaris:", err);
    res.status(500).json({ message: "Error obtenint usuaris" });
  }
});

/** Actualitzar dades de l'usuari loguejat */
router.put("/me", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { name, email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuari no trobat" });

    // Actualitzar nom i email si arriben
    if (name) user.name = name;
    if (email) user.email = email;

    // Canvi de contrasenya si es demana
    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Cal la contrasenya actual per canviar-la" });
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return res.status(400).json({ message: "Contrasenya actual incorrecta" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualitzant usuari" });
  }
});

export default router;
