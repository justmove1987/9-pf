import { Router, type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import Project from "../models/Project.ts";
import { upload } from "../middleware/upload.ts";

const router = Router();

// Middleware per comprovar token i rol
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
    // 👇 aquí ja sabem que token és string
    const payload = jwt.verify(token as string, process.env.JWT_SECRET || "secret") as any;

    if (payload.role !== "admin" && payload.role !== "editor") {
      return res.status(403).json({ message: "Només editors o admins poden crear projectes" });
    }

    (req as any).userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ message: "Token invàlid" });
  }
}


// GET /projects  ← Aquesta és la que falta si dóna 404
router.get("/", async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obtenint projectes" });
  }
});

/* --- Crear projecte amb pujada d’imatge de portada --- */
router.post(
  "/",
  requireRoleEditorOrAdmin,
  upload.single("cover"),  
               // <== important: el nom 'cover'
  async (req: Request, res: Response) => {
    
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No s'ha pujat cap imatge de portada" });
      }
      const { title, author, content } = req.body;

      const project = new Project({
        title,
        author,
        content,
        imageUrl: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
        createdBy: (req as any).userId,
      });

      await project.save();
      res.json(project);
    } catch (err) {
      console.error("❌ Error creant projecte:", err);
      res.status(500).json({ message: "Error creant projecte" });
    }
  }
);

export default router;
