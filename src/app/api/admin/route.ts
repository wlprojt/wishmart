// src/app/api/admin/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { cookies } from "next/headers";
import { getUser } from "@/lib/getUser";

const ADMIN_ID = process.env.ADMIN_ID;

if (!ADMIN_ID) {
  throw new Error("ADMIN_ID is not defined in env");
}

/* ===========================
   CREATE PRODUCT (ADMIN ONLY)
=========================== */
export async function POST(req: Request) {
  try {
    // 🔐 Admin auth
    const authHeader = req.headers.get("authorization");
    let token =
      authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : (await cookies()).get("token")?.value;

        const user = await getUser();
          if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });


    if (!user?.id || user.id !== ADMIN_ID) {
      return NextResponse.json(
        { message: "Forbidden: Admin only" },
        { status: 403 }
      );
    }

    // 🗄️ DB
    await connectDB();

    const body = await req.json();

    console.log("✅ Product payload:", body);

    const product = await Product.create(body);

    return NextResponse.json(
      { message: "Product Added Successfully", product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Product Error:", error);
    return NextResponse.json(
      { message: error.message || "Error Adding Product" },
      { status: 500 }
    );
  }
}

/* ===========================
   GET PRODUCTS (PUBLIC)
=========================== */
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 });

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("GET Product Error:", error);
    return NextResponse.json(
      { message: "Error Fetching Products" },
      { status: 500 }
    );
  }
}
