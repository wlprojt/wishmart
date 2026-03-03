// src/app/api/cart/clear/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { getUser } from "@/lib/getUser";

type OkResponse = { ok: true };
type UnauthorizedResponse = { error: "Unauthorized" };

export async function POST() {
  await connectDB();

  const user = await getUser();
  if (!user) {
    return NextResponse.json<UnauthorizedResponse>(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // ✅ clear cart items
  await Cart.updateOne(
    { userId: user.id },
    { $set: { items: [] } },
    { upsert: true }
  );

  return NextResponse.json<OkResponse>({ ok: true });
}