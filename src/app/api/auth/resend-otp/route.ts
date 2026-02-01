import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendOTPEmail } from "@/lib/send-email";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user || user.emailVerified) {
      return NextResponse.json(
        { message: "Invalid request" },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    user.emailOTP = otp;
    user.emailOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail(user.email, otp);

    return NextResponse.json(
      { message: "OTP resent" },
      { status: 200 }
    );

  } catch {
    return NextResponse.json(
      { message: "Failed to resend OTP" },
      { status: 500 }
    );
  }
}