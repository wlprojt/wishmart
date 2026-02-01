import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}

const resend = new Resend(RESEND_API_KEY);

export async function sendOTPEmail(email: string, otp: string) {
  try {
    await resend.emails.send({
      from: "Auth <onboarding@resend.dev>", // ✅ verified sender
      to: email,
      subject: "Your verification code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>Email Verification</h2>
          <p>Your one-time password (OTP) is:</p>
          <h1 style="letter-spacing: 6px; font-size: 32px">${otp}</h1>
          <p>This code expires in <strong>10 minutes</strong>.</p>
          <p style="color: #888; font-size: 12px">
            If you did not request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("❌ Failed to send OTP email", error);
    throw new Error("Email delivery failed");
  }
}
