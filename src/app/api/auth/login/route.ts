// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  if (!user.emailVerified) {
    return NextResponse.json(
      { message: "Please verify your email" },
      { status: 403 }
    );
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = signToken({ id: user._id });

  const res = NextResponse.json({
    token, // 🔥 REQUIRED FOR ANDROID
    user: {
      id: user._id,
      email: user.email,
    },
  });

  // Keep cookie for web
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res;
}