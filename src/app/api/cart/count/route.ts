// src/app/api/cart/count/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { getUser } from "@/lib/getUser";

export async function GET() {
  await connectDB();

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ count: 0 });
  }

  const cart = await Cart.findOne({ userId: user.id });

  const count =
    cart?.items.reduce((sum: number, i: any) => sum + i.qty, 0) || 0;

  return NextResponse.json({ count });
}
