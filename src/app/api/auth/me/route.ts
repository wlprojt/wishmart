// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyJwt } from "@/lib/jwt";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const cookieToken = (await cookies()).get("token")?.value;

  let token: string | undefined;
  let source: "bearer" | "cookie" | "none" = "none";

  if (auth?.startsWith("Bearer ")) {
    token = auth.slice(7);
    source = "bearer";
  } else if (cookieToken) {
    token = cookieToken;
    source = "cookie";
  }

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized", debug: { source, hasCookie: !!cookieToken } },
      { status: 401 }
    );
  }

  let decoded: any;
  try {
    decoded = verifyJwt(token);
  } catch {
    return NextResponse.json(
      { error: "Invalid token", debug: { source } },
      { status: 401 }
    );
  }

  await connectDB();
  const user = await User.findById(decoded.id);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized", debug: { source } },
      { status: 401 }
    );
  }

  return NextResponse.json({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    provider: user.provider,
    image: user.image,
    emailVerified: user.emailVerified,
    debug: { source },
  });
}