import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.ts";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // ✅ buscar per email
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
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al iniciar sessió" });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // comprovar si ja existeix
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email ja registrat" });
    }

    // encriptar contrasenya
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      role: "user",
    });

    await user.save();

    // opcional: crear token per iniciar sessió automàticament
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el registre" });
  }
});


export default router;
