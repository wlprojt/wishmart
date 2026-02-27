// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signJwt } from "@/lib/jwt";
import { setAuthCookie } from "@/lib/auth-response";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  await connectDB();

  const user = await User.findOne({ email });

  if (!user.emailVerified) {
  return NextResponse.json(
    { error: "Please verify your email first" },
    { status: 403 }
  );
}

  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signJwt({ id: user._id.toString() });

  let res = NextResponse.json({ token, user: safeUser(user) });
  res = setAuthCookie(res, token);
  return res;
}

function safeUser(u: any) {
  return {
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    provider: u.provider,
    image: u.image,
    emailVerified: u.emailVerified,
  };
}