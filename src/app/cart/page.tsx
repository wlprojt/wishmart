"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

interface CartItem {
  _id: string;
  productId: string;
  title: string;
  price: number;
  sale_price?: number | null;
  image: string;
  qty: number;
  stock: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    const res = await fetch("/api/cart");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ---------------- UPDATE QTY ---------------- */
  const updateQty = async (id: string, qty: number) => {
  const prev = [...items];

  setItems((items) =>
    items.map((i) =>
      i._id === id
        ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) }
        : i
    )
  );

  const res = await fetch("/api/cart", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, qty }),
  });

  if (!res.ok) {
    setItems(prev);
    alert("Failed to update quantity");
  } else {
    window.dispatchEvent(new Event("cart-updated")); // ✅
  }
};


  /* ---------------- REMOVE ITEM ---------------- */
  const removeItem = async (id: string) => {
  const prev = [...items];
  setItems((items) => items.filter((i) => i._id !== id));

  const res = await fetch("/api/cart", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    setItems(prev);
    alert("Failed to remove item");
  } else {
    window.dispatchEvent(new Event("cart-updated")); // ✅
  }
};

  /* ---------------- TOTAL ---------------- */
  const total = items.reduce(
    (sum, i) => sum + (i.sale_price ?? i.price) * i.qty,
    0
  );

  if (loading) return <p className="p-6">Loading cart…</p>;

  if (!items.length)
    return (
      <div className="p-6 text-center">
        <p>Your cart is empty 🛒</p>
        <Link href="/" className="text-blue-600 underline">
          Continue shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 border rounded-md p-4"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={80}
              height={80}
              className="rounded object-cover"
            />

            <div className="flex-1">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-500">
                ₹{(item.sale_price ?? item.price).toLocaleString("en-IN")}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  disabled={item.qty === 1}
                  onClick={() => updateQty(item._id, item.qty - 1)}
                  className="px-2 border rounded disabled:opacity-40"
                >
                  −
                </button>

                <span>{item.qty}</span>

                <button
                  disabled={item.qty >= item.stock}
                  onClick={
                    () => updateQty(item._id, item.qty + 1)
                  }
                  className="px-2 border rounded disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {item.qty >= item.stock && (
                <p className="text-xs text-red-500 mt-1">
                  Max stock reached
                </p>
              )}
            </div>

            <button
              onClick={() => removeItem(item._id)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 border-t pt-4">
        <p className="text-lg font-semibold">Total</p>
        <p className="text-xl font-bold">
          ₹{total.toLocaleString("en-IN")}
        </p>
      </div>

      <div className="mt-6 text-right">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
          Checkout
        </button>
      </div>
    </div>
  );
}
