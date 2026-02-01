// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/send-email";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }


    await connectDB();

    const existingUser = await User.findOne({ email });

    // 🔁 CASE 1: User exists but NOT verified → resend OTP
    if (existingUser && !existingUser.emailVerified) {
      const otp = generateOTP();

      existingUser.emailOTP = otp;
      existingUser.emailOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
      await existingUser.save();

      await sendOTPEmail(existingUser.email, otp);

      return NextResponse.json(
        { message: "OTP resent", requiresVerification: true },
        { status: 200 }
      );
    }

    // ❌ CASE 2: User exists and verified → block
    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // ✅ CASE 3: New user
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
      emailOTP: otp,
      emailOTPExpires: new Date(Date.now() + 10 * 60 * 1000)
    });

    await sendOTPEmail(user.email, otp);

    return NextResponse.json(
      { message: "Signup successful", requiresVerification: true },
      { status: 201 }
    );

  } catch (err) {
    return NextResponse.json(
      { message: "Signup failed" },
      { status: 500 }
    );
  }
}