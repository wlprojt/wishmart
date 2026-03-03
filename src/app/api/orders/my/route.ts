// src/app/api/orders/my/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getUser } from "@/lib/getUser";

export async function GET() {
  try {
    await connectDB();

    const user = await getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const orders = await Order.find({
      userId: user.id, // ✅ FIX
    }).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}