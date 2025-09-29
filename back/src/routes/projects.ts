import { Router, type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import Project from "../models/Project.ts";
import requireRole from "../middleware/requireRole.ts";

const router = Router();

/* ─────────────── Middleware: requiere token y guarda userId + userRole ─────────────── */
function requireRoleEditorOrAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token requerit" });
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Format d'autorització invàlid" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
    // Guardamos en req para usar después
    (req as any).userId = payload.id;
    (req as any).userRole = payload.role;

    // Solo admin o editor pueden continuar
    if (payload.role !== "admin" && payload.role !== "editor") {
      return res.status(403).json({ message: "Només editors o admins poden crear projectes" });
    }

    next();
  } catch {
    return res.status(401).json({ message: "Token invàlid" });
  }
}

/* ─────────────── Obtener todos los proyectos (público) ─────────────── */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obtenint projectes" });
  }
});

/* ─────────────── Crear un proyecto (rol editor o admin) ─────────────── */
router.post("/", requireRoleEditorOrAdmin, async (req: Request, res: Response) => {
  const { title, subtitle, category, content, imageUrl, author } = req.body;

  try {
    const project = new Project({
      title,
      subtitle,
      category,
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

// 🗑️ Eliminar projecte (només admin)
router.delete("/:id", requireRoleEditorOrAdmin, async (req: Request, res: Response) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminant projecte" });
  }
});

export default router;
