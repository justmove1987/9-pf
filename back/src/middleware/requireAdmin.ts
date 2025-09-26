import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token requerit" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).json({ message: "Format d'autorització invàlid" });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Només per a administradors" });
    }
    next();
  } catch {
    return res.status(401).json({ message: "Token invàlid" });
  }
}
