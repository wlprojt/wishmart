// src/app/api/auth/forgot-password/route.ts

import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { message: "Email is required" },
      { status: 400 }
    );
  }

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    // 🔐 Do NOT reveal account existence
    return NextResponse.json({
      message: "If the email exists, a reset link was sent",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await user.save();

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "Auth <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });

  return NextResponse.json({
    message: "If the email exists, a reset link was sent",
  });
}