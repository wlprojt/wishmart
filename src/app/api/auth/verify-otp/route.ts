import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { signJwt } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  await connectDB();

  // ✅ check OTP + expiry
  const record = await Otp.findOne({
    email,
    otp,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    return NextResponse.json(
      { error: "Invalid or expired OTP" },
      { status: 401 }
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.emailVerified = true;
  await user.save();

  await Otp.deleteMany({ email });

  const token = signJwt({ id: user._id.toString() });

  const res = NextResponse.json({
    ok: true,
    token,
    user: { id: user._id.toString(), email: user.email },
  });

  // ✅ keep cookie for web
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}