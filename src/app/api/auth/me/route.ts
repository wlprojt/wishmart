// src/app/api/auth/me/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  let token: string | undefined;

  // 1️⃣ Authorization header (Android / iOS)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  // 2️⃣ Cookie fallback (Web)
  if (!token) {
    token = (await cookies()).get("token")?.value;
  }

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  let decoded: { id: string };

  try {
    decoded = verifyToken(token) as { id: string };
  } catch {
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }

  await connectDB();

  const user = await User.findById(decoded.id).select(
    "_id email emailVerified createdAt"
  );

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  // 🔐 Block unverified users
  if (!user.emailVerified) {
    return NextResponse.json(
      { message: "Email not verified" },
      { status: 403 }
    );
  }

  // ✅ Safe response DTO
  return NextResponse.json({
    id: user._id,
    email: user.email,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  });
}