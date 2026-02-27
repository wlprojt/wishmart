// src/lib/jwt.ts
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

export type AppJwtPayload = JwtPayload & {
  id: string; // we will always store user id in "id"
};

export function signJwt(payload: AppJwtPayload | { id: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyJwt(token: string): AppJwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET);

  // jwt.verify can return string in some cases; we reject that
  if (typeof decoded === "string" || !decoded || typeof decoded !== "object") {
    throw new Error("Invalid token");
  }

  // ensure "id" exists
  const payload = decoded as AppJwtPayload;
  if (!payload.id) throw new Error("Invalid token payload");

  return payload;
}