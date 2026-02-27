// src/app/api/auth/session-to-jwt/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const token = (await cookies()).get("token")?.value;

  // If token already exists, OK. If not, 401 (same behavior as your old flow)
  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}