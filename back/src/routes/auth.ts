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
    res.status(500).json({ message: "Error al iniciar sessió" });
  }
});

/* ---------- REGISTER ---------- */
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    // Si és el teu correu → admin; en cas contrari el model posarà "subscriber"
    const role = email === "enricabadrovira@gmail.com" ? "admin" : undefined;

    const user = new User({
      name,
      email,
      password: hashed,
      ...(role ? { role } : {}), // només afegim role si és admin
    });

    await user.save();

    res.json({
      message: "Usuari creat correctament",
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el registre" });
  }
});

export default router;
