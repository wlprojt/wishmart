// src/app/api/products/suggestions/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json([]);
    }

    const suggestions = await Product.find(
      {
        title: { $regex: q, $options: "i" },
      },
      { title: 1, images: 1 }
    )
      .limit(6)
      .lean();

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Search suggestions error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
