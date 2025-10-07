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
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
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
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Aquest correu ja està registrat" });

    const hashed = await bcrypt.hash(password, 10);
    const role = email === "enricabadrovira@gmail.com" ? "admin" : "editor";

    const user = new User({ name, email, password: hashed, role });
    await user.save();

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Usuari creat correctament",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      },
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
    if (password) updateFields.password = await bcrypt.hash(password, 10);

    const updated = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      select: "-password",
    });

    if (!updated) return res.status(404).json({ message: "Usuari no trobat" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualitzant usuari" });
  }
});

/* ----------------------- Bloquejar / activar usuari ----------------------- */
router.patch("/users/:id/toggle", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const adminId = (req as any).user?.id;

    // Evita que un admin es bloquegi a ell mateix
    if (id === adminId)
      return res
        .status(400)
        .json({ message: "No pots bloquejar o desactivar el teu propi compte" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Usuari no trobat" });

    user.active = typeof active === "boolean" ? active : !user.active;
    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error canviant estat d'usuari" });
  }
});

/* ----------------------- Eliminar usuari ----------------------- */
router.delete("/users/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id;

    if (id === adminId)
      return res
        .status(400)
        .json({ message: "No pots eliminar el teu propi compte" });

    await User.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminant usuari" });
  }
});

export default router;
