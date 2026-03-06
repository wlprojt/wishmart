// src/app/api/admin/upload/route.ts

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { cookies } from "next/headers";
import { getUser } from "@/lib/getUser";

if (!process.env.ADMIN_ID) {
  throw new Error("ADMIN_ID is not defined in env");
}

const ADMIN_ID = process.env.ADMIN_ID;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Helper: upload buffer to Cloudinary
function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url) return reject(new Error("No URL returned from Cloudinary"));
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

export async function POST(req: Request) {
  try {
    // 🔐 Admin JWT check

    // 1️⃣ Check Authorization header
    const authHeader = req.headers.get("authorization");
    let token: string | undefined = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : undefined;



    const user = await getUser();
              if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    


    if (!user?.id) {
      console.error("User invalid or missing id");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.id !== ADMIN_ID) {
      console.error("Forbidden: not admin");
      return NextResponse.json({ message: "Forbidden: Admin only" }, { status: 403 });
    }

    // ✅ Parse form and get file
    const form = await req.formData();
    const file = form.get("file") as Blob;

    if (!file) {
      console.error("No file provided");
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ Upload to Cloudinary
    const url = await uploadToCloudinary(buffer);

    return NextResponse.json({ url }, { status: 200 });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ message: "Upload error", error: err.message || err }, { status: 500 });
  }
}
