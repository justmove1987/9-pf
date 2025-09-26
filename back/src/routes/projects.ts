import { Router, type Request, type Response } from "express";
import requireAuth from "../middleware/requireAdmin.ts";
import Project from "../models/Project.ts";

const router = Router();

/** Obtener todos los proyectos (público) */
router.get("/", async (_req: Request, res: Response) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

/** Crear un proyecto (rol editor o admin) */
router.post("/", requireAuth, async (req: Request, res: Response) => {
  const { title, content, imageUrl, author } = req.body;
  const role = (req as any).userRole;

  if (role !== "editor" && role !== "admin") {
    return res.status(403).json({ message: "Només editors o admins poden crear projectes" });
  }

  try {
    const project = new Project({
      title,
      content,
      imageUrl,
      author,
      createdBy: (req as any).userId,
    });
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creant projecte" });
  }
});

export default router;

