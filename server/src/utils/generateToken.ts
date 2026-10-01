// server/src/utils/generateToken.ts
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function generateToken(payload: {
  id: string;
  email: string;
  name: string;
  awardSpace: string;
}) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}
