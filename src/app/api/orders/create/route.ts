// src/app/api/orders/create/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await connectDB();

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const body = await req.json();

  const order = await Order.create({
    userId: decoded.id,
    email: body.email,
    billing: body.billing,
    items: body.items,
    totalAmount: body.totalAmount,
  });

  return NextResponse.json(order);
}
