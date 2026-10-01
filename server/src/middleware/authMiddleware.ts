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
    };

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
