import { Router } from "express";
import type { Request, Response } from "express";
import User from "../models/User.ts";
import bcrypt from "bcrypt";
import requireAdmin from "../middleware/requireAdmin.ts";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // Hashed password
    const hashed = await bcrypt.hash(password, 10);

    // 🔑 Aquí decidim el rol: admin si és el teu correu, si no, editor
    const role = email === "enricabadrovira@gmail.com" ? "admin" : "editor";

    const user = new User({
      name,
      email,
      password: hashed,
      role,           // 👈 afegim el camp role
    });

    await user.save();

    res.json({
      message: "Usuari creat correctament",
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Error en el registre" });
  }
});


router.put("/users/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;
  const updated = await User.findByIdAndUpdate(id, { name, role }, { new: true });
  res.json(updated);
});

router.delete("/users/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ success: true });
});

export default router;
