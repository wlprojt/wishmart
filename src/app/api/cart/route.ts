// src/app/api/cart/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { getUser } from "@/lib/getUser";

/* ---------------- GET ---------------- */
export async function GET() {
  await connectDB();

  const user = await getUser();
  if (!user) return NextResponse.json({ items: [] });

  const cart = await Cart.findOne({ userId: user.id })
    .populate("items.productId");

  if (!cart) return NextResponse.json({ items: [] });

  const items = cart.items.map((i: any) => ({
    _id: i._id.toString(),
    productId: i.productId._id.toString(),
    title: i.productId.title,
    price: i.productId.price,
    sale_price: i.productId.sale_price,
    image: i.productId.images?.[0],
    stock: i.productId.stock,
    qty: i.qty,
  }));

  return NextResponse.json({ items });
}

/* ---------------- POST (Add to cart) ---------------- */
export async function POST(req: Request) {
  await connectDB();

  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, qty } = await req.json();

  let cart = await Cart.findOne({ userId: user.id });
  if (!cart) {
    cart = await Cart.create({ userId: user.id, items: [] });
  }

  const index = cart.items.findIndex(
    (i: any) => i.productId.toString() === productId
  );

  if (index > -1) {
    cart.items[index].qty += qty;
  } else {
    cart.items.push({ productId, qty });
  }

  await cart.save();
  return NextResponse.json({ ok: true });
}

/* ---------------- PUT (Update qty) ---------------- */
export async function PUT(req: Request) {
  await connectDB();

  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, qty } = await req.json();

  const cart = await Cart.findOne({ userId: user.id });
  if (!cart) return NextResponse.json({ ok: false });

  const item = cart.items.id(id);
  if (!item)
    return NextResponse.json({ error: "Item not found" }, { status: 404 });

  item.qty = qty;
  await cart.save();

  return NextResponse.json({ ok: true });
}

/* ---------------- DELETE ---------------- */
export async function DELETE(req: Request) {
  await connectDB();

  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();

  const cart = await Cart.findOne({ userId: user.id });
  if (!cart) return NextResponse.json({ ok: false });

  cart.items = cart.items.filter(
    (i: any) => i._id.toString() !== id
  );

  await cart.save();
  return NextResponse.json({ ok: true });
}
