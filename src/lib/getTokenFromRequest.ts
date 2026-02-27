// src/lib/getTokenFromRequest.ts
import { NextRequest } from "next/server";

export function getTokenFromRequest(req: NextRequest): string | null {
  // 1️⃣ Check Authorization header (Android)
  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  // 2️⃣ Fallback to cookie (Web)
  const cookieToken = req.cookies.get("token")?.value;

  return cookieToken ?? null;
}
