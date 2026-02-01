// src/app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json(
      { message: "Missing email or OTP" },
      { status: 400 }
    );
  }

  await connectDB();

  const user = await User.findOne({ email });

  if (
    !user ||
    user.emailOTP !== otp ||
    !user.emailOTPExpires ||
    user.emailOTPExpires < new Date()
  ) {
    return NextResponse.json(
      { message: "Invalid or expired OTP" },
      { status: 400 }
    );
  }

  // ✅ Verify user
  user.emailVerified = true;
  user.emailOTP = undefined;
  user.emailOTPExpires = undefined;
  await user.save();

  // ✅ Create JWT
  const token = signToken({ id: user._id });

  const res = NextResponse.json({
    ok: true,
    token, // 🔥 mobile support
  });

  // ✅ Cookie for web
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res;
}
