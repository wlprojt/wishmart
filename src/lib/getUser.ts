// src/lib/getUser.ts
import { cookies, headers } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export type CurrentUser = {
  id: string;
  email: string;
  name?: string | null;
  provider?: string;
  image?: string | null;
  emailVerified?: boolean;
};

export async function getUser(): Promise<CurrentUser | null> {
  const authHeader = (await headers()).get("authorization");
  let token: string | undefined;

  if (authHeader?.startsWith("Bearer ")) token = authHeader.slice(7);
  if (!token) token = (await cookies()).get("token")?.value;
  if (!token) return null;

  let decoded: any;
  try {
    decoded = verifyJwt(token) as any;
  } catch {
    return null;
  }

  // ✅ works for login/google/otp tokens
  const id = decoded.id || decoded.userId;
  if (!id) return null;

  await connectDB();
  const user = await User.findById(id);
  if (!user) return null;

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name ?? null,
    provider: user.provider,
    image: user.image ?? null,
    emailVerified: user.emailVerified,
  };
}