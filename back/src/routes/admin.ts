import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
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
    // Encripta la contrasenya
    const hashed = await bcrypt.hash(password, 10);

    // Assigna rol: admin si és el teu correu, sinó editor
    const role = email === "enricabadrovira@gmail.com" ? "admin" : "editor";

    const user = new User({
      name,
      email,
      password: hashed,
      role,
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

/* ----------------------- Editar usuari ----------------------- */
router.put("/users/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;
    const updated = await User.findByIdAndUpdate(
      id,
      { name, role },
      { new: true }
    );
    res.json(updated);
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
