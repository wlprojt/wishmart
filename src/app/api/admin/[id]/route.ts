// src/app/api/admin/[id]/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

type Params = {
  params: {
    id: string;
  };
};

const ADMIN_ID = process.env.ADMIN_ID;

if (!ADMIN_ID) {
  throw new Error("ADMIN_ID is not defined in env");
}

export async function GET(req: Request, context: Params) {
  try {
    // 🔐 Admin auth
        const authHeader = req.headers.get("authorization");
        let token =
          authHeader?.startsWith("Bearer ")
            ? authHeader.substring(7)
            : (await cookies()).get("token")?.value;
    
        if (!token) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    
        const decoded: any = verifyToken(token);
    
        if (!decoded?.id || decoded.id !== ADMIN_ID) {
          return NextResponse.json(
            { message: "Forbidden: Admin only" },
            { status: 403 }
          );
        }

    // 🗄️ DB
    await connectDB();

    const { id } = await context.params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error Fetching Product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: Params) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = await context.params;

    const updated = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { message: "Product Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product Updated Successfully",
      product: updated,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error Updating Product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: Params) {
  try {
    // 🔐 Admin auth
        const authHeader = req.headers.get("authorization");
        let token =
          authHeader?.startsWith("Bearer ")
            ? authHeader.substring(7)
            : (await cookies()).get("token")?.value;
    
        if (!token) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    
        const decoded: any = verifyToken(token);
    
        if (!decoded?.id || decoded.id !== ADMIN_ID) {
          return NextResponse.json(
            { message: "Forbidden: Admin only" },
            { status: 403 }
          );
        }
    // 🗄️ DB
    await connectDB();

    const { id } = await context.params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Product Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error Deleting Product" },
      { status: 500 }
    );
  }
}
