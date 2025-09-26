import { Router, type Request, type Response } from "express";
import Project from "../models/Project.ts"; // assegura’t de tenir el model

const router = Router();

// Llistar tots els projectes
router.get("/", async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obtenint projectes" });
  }
});

export default router;
