import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export default function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "Token requerit" });

    const [bearer, token] = header.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ message: "Format d'autorització invàlid" });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
      if (!roles.includes(payload.role)) {
        return res.status(403).json({ message: "Permisos insuficients" });
      }
      (req as any).userId = payload.id;
      next();
    } catch {
      return res.status(401).json({ message: "Token invàlid" });
    }
  };
}
