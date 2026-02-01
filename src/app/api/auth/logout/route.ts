// src/app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();

  // 1️⃣ Remove YOUR JWT
  cookieStore.delete("token");

  // 2️⃣ Destroy Better-Auth session (Google, etc.)
  await auth.api.signOut({
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  // 3️⃣ Safety: remove all better-auth cookies
  cookieStore.getAll().forEach((c) => {
    if (c.name.startsWith("better-auth")) {
      cookieStore.delete(c.name);
    }
  });

  return NextResponse.json({ ok: true });
}



