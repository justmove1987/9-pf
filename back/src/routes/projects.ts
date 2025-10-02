import { Router, type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import Project from "../models/Project.ts";

const router = Router();

/* ─────────────── Middleware opcional ─────────────── */
function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const [bearer, token] = authHeader.split(" ");
    if (bearer === "Bearer" && token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
        (req as any).userId = payload.id;
        (req as any).userRole = payload.role;
      } catch {
        // si el token no és vàlid, l’ignorem → usuari serà públic
      }
    }
  }
  next();
}

function requireRoleEditorOrAdmin(req: Request, res: Response, next: NextFunction) {
  const role = (req as any).userRole;
  if (role !== "admin" && role !== "editor") {
    return res.status(403).json({ message: "Només editors o admins tenen permís" });
  }
  next();
}

/* ─────────────── GET projectes ─────────────── */
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const role = (req as any).userRole;
    const filter = role === "admin" || role === "editor"
      ? {}                // veuen tots
      : { status: "published" }; // públic només publicats

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obtenint projectes" });
  }
});

/* ─────────────── Crear projecte ─────────────── */
router.post("/", optionalAuth, requireRoleEditorOrAdmin, async (req: Request, res: Response) => {
  const { title, subtitle, category, content, imageUrl, author, status } = req.body;

  try {
    const project = new Project({
      title,
      subtitle,
      category,
      content,
      imageUrl,
      author,
      createdBy: (req as any).userId,
      status: status || "draft",
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creant projecte" });
  }
});

/* ─────────────── Update + Delete ─────────────── */
router.put("/:id", optionalAuth, requireRoleEditorOrAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: "No trobat" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Error actualitzant" });
  }
});

router.delete("/:id", optionalAuth, requireRoleEditorOrAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error eliminant" });
  }
});

export default router;
