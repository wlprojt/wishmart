// src/app/api/cart/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import "@/models/Product";
import { getUser } from "@/lib/getUser";
import { cookies } from "next/headers";

type CartItemDTO = {
  _id: string;
  productId: string;
  title: string;
  price: number;
  sale_price?: number | null;
  image?: string | null;
  stock: number;
  qty: number;
};

type CartGetResponse = { items: CartItemDTO[] };
type OkResponse = { ok: true };
type UnauthorizedResponse = { error: "Unauthorized" };
type NotFoundResponse = { error: "Item not found" };
type BadRequestResponse = { error: string };

/* ---------------- GET ---------------- */
export async function GET() {
  await connectDB();

  const user = await getUser();
  if (!user) return NextResponse.json<CartGetResponse>({ items: [] });

  const cart = await Cart.findOne({ userId: user.id }).populate("items.productId");
  if (!cart) return NextResponse.json<CartGetResponse>({ items: [] });

  const items: CartItemDTO[] = cart.items.map((i: any) => ({
    _id: i._id.toString(),
    productId: i.productId?._id?.toString(),
    title: i.productId?.title,
    price: i.productId?.price,
    sale_price: i.productId?.sale_price ?? null,
    image: i.productId?.images?.[0] ?? null,
    stock: i.productId?.stock ?? 0,
    qty: i.qty ?? 1,
  }));

  return NextResponse.json<CartGetResponse>({ items });
}

/* ---------------- POST (Add to cart) ---------------- */
export async function POST(req: Request) {
  await connectDB();

  const user = await getUser();
  if (!user) {
    return NextResponse.json<UnauthorizedResponse>(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);
  const productId = body?.productId as string | undefined;
  const qtyRaw = body?.qty;

  const qty = Number(qtyRaw ?? 1);

  if (!productId || !Number.isFinite(qty) || qty <= 0) {
    return NextResponse.json<BadRequestResponse>(
      { error: "Invalid productId or qty" },
      { status: 400 }
    );
  }

  let cart = await Cart.findOne({ userId: user.id });
  if (!cart) cart = await Cart.create({ userId: user.id, items: [] });

  const index = cart.items.findIndex((i: any) => i.productId.toString() === productId);

  if (index > -1) {
    cart.items[index].qty = (cart.items[index].qty ?? 0) + qty;
  } else {
    cart.items.push({ productId, qty });
  }

  await cart.save();
  return NextResponse.json<OkResponse>({ ok: true });
}

/* ---------------- PUT (Update qty) ---------------- */
export async function PUT(req: Request) {
  await connectDB();

  const user = await getUser();
  const auth = req.headers.get("authorization");
  const cookieToken = (await cookies()).get("token")?.value;
  if (!user) {
  return NextResponse.json(
    { error: "Unauthorized", debug: { hasAuth: !!auth, hasCookie: !!cookieToken } },
    { status: 401 }
  );
  }

  const body = await req.json().catch(() => null);
  const id = body?.id as string | undefined;
  const qty = Number(body?.qty);

  if (!id || !Number.isFinite(qty) || qty < 1) {
    return NextResponse.json<BadRequestResponse>(
      { error: "Invalid id or qty" },
      { status: 400 }
    );
  }

  const cart = await Cart.findOne({ userId: user.id });
  if (!cart) return NextResponse.json({ ok: false });

  const item = cart.items.id(id);
  if (!item) {
    return NextResponse.json<NotFoundResponse>(
      { error: "Item not found" },
      { status: 404 }
    );
  }

  item.qty = qty;
  await cart.save();

  return NextResponse.json<OkResponse>({ ok: true });
}

/* ---------------- DELETE ---------------- */
export async function DELETE(req: Request) {
  await connectDB();

  const user = await getUser();
  if (!user) {
    return NextResponse.json<UnauthorizedResponse>(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);
  const id = body?.id as string | undefined;

  if (!id) {
    return NextResponse.json<BadRequestResponse>(
      { error: "Invalid id" },
      { status: 400 }
    );
  }

  const cart = await Cart.findOne({ userId: user.id });
  if (!cart) return NextResponse.json({ ok: false });

  cart.items = cart.items.filter((i: any) => i._id.toString() !== id);

  await cart.save();
  return NextResponse.json<OkResponse>({ ok: true });
}