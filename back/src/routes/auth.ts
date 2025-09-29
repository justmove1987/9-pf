import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.ts";

const router = Router();

/* ---------- LOGIN ---------- */
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuari no trobat" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Contrasenya incorrecta" });

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error iniciant sessió" });
  }
});

/* ---------- REGISTER (corregit) ---------- */
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    // Rol per defecte: admin si és el teu correu, sinó subscriber
    const role = email === "enricabadrovira@gmail.com" ? "admin" : "subscriber";

    const user = new User({
      name,
      email,
      password: hashed,
      role,
    });

    await user.save();

    // ✅ Generar token per a l’usuari acabat de crear
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el registre" });
  }
});

export default router;
