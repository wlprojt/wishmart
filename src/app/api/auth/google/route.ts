
// src/app/api/auth/google/route.ts
import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signJwt } from "@/lib/jwt";
import { setAuthCookie } from "@/lib/auth-response";

const client = new OAuth2Client(); // ✅ don't lock to one client id

const AUDIENCES = [
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_IOS_CLIENT_ID,
  process.env.GOOGLE_ANDROID_CLIENT_ID,
].filter(Boolean) as string[];

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: AUDIENCES.length ? AUDIENCES : undefined,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
    }

    await connectDB();

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        provider: "google",
        emailVerified: payload.email_verified ?? true,
      });
    }

    const token = signJwt({ id: user._id.toString() });

    let res = NextResponse.json({ token, user: safeUser(user) });
    res = setAuthCookie(res, token);
    return res;
  } catch (err: any) {
    console.error("Google auth error:", err);
    return NextResponse.json(
      { error: err?.message || "Google login failed" },
      { status: 500 }
    );
  }
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