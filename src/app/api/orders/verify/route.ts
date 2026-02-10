// src/app/api/orders/verify/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  await connectDB();

  const { orderId, razorpayOrderId, razorpayPaymentId } = await req.json();

  await Order.findByIdAndUpdate(orderId, {
    razorpayOrderId,
    razorpayPaymentId,
    paymentStatus: "paid",
  });

  return NextResponse.json({ success: true });
}
