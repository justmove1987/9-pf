import { Router } from "express";
import type { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ msg: "Contraseña incorrecta" });

  const token = jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );
  res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
});
