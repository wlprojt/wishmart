// src/app/api/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function ALL(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // Forward request
  return NextResponse.next();
}