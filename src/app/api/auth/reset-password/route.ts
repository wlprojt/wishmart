import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || !password || password.length < 6) {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 }
    );
  }

  await connectDB();

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return NextResponse.json({
    message: "Password reset successful",
  });
}