// src/app/api/auth/session-to-jwt/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { signToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { cookies, headers } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // Already have JWT
  if (cookieStore.get("token")) {
    return NextResponse.json({ ok: true });
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user?.email) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await connectDB();

  let user = await User.findOne({ email: session.user.email });

  if (!user) {
    user = await User.create({
      email: session.user.email,
      name: session.user.name,
      emailVerified: true,
    });
  }

  const token = signToken({ id: user._id });

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({ ok: true, token });
}
