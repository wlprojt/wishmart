// src/lib/auth-response.ts
import { NextResponse } from "next/server";

export function setAuthCookie<T>(res: NextResponse<T>, token: string) {
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}