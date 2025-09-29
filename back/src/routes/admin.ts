import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.ts";
import requireAdmin from "../middleware/requireAdmin.ts";

const router = Router();

/* ----------------------- Llistar tots els usuaris ----------------------- */
router.get("/users", requireAdmin, async (_req: Request, res: Response) => {
  try {
    // Retorna tots els usuaris excepte el camp password
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obtenint usuaris" });
  }
});

/* ----------------------- Registrar un nou usuari ----------------------- */
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    // Rol per defecte: admin si és el teu correu, sinó editor
    const role = email === "enricabadrovira@gmail.com" ? "admin" : "editor";

    const user = new User({
      name,
      email,
      password: hashed,
      role,
    });

    await user.save();

    // ✅ Generar token perquè el front pugui iniciar sessió automàticament
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Usuari creat correctament",
      token, // 👈 ara també retornem el token
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el registre" });
  }
});

/* ----------------------- Editar usuari ----------------------- */
router.put("/users/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    const updateFields: Record<string, any> = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;

    // Si s’ha passat una nova contrasenya l’encriptem
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      select: "-password", // no retornar el hash
    });

    if (!updated) {
      return res.status(404).json({ message: "Usuari no trobat" });
    }

    res.json({
      id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualitzant usuari" });
  }
});

/* ----------------------- Eliminar usuari ----------------------- */
router.delete("/users/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminant usuari" });
  }
});

export default router;
