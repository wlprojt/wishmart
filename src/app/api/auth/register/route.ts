// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { sendOTPEmail } from "@/lib/send-email";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectDB();

  const existingUser = await User.findOne({ email });

  // ❌ Block only if verified
  if (existingUser && existingUser.emailVerified) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // 🔁 If exists but NOT verified → update user
  if (existingUser && !existingUser.emailVerified) {
    existingUser.name = name;
    existingUser.passwordHash = passwordHash;
    await existingUser.save();
  } else {
    // 🆕 Create new user
    await User.create({
      name,
      email,
      passwordHash,
      provider: "local",
      emailVerified: false,
    });
  }

  // 🔐 Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Optional: delete old OTPs for this email
  await Otp.deleteMany({ email });

  await Otp.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOTPEmail(email, otp);

  return NextResponse.json({ ok: true });
}