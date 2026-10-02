import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    awardSpace: string;
  };
}

export function protect(req: AuthRequest, res: Response, next: NextFunction) {
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) return res.status(503).json({ message: "Server authentication is not securely configured" });
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
      awardSpace: string;
      exp?: number;
    };

    if (!decoded.id || !decoded.email || !decoded.awardSpace) return res.status(401).json({ message: "Invalid token claims" });

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      awardSpace: decoded.awardSpace,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
