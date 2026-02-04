// src/app/api/products/sale/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({
      sale_price: { $ne: null }, // ✅ only sale products
    })
      .sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Sale products error:", error);
    return NextResponse.json(
      { message: "Failed to fetch sale products" },
      { status: 500 }
    );
  }
}
