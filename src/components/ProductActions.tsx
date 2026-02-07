"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductActions({
  stock,
  productId,
}: {
  stock: number;
  productId: string;
}) {
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const handleAddToCart = async (productId: string) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, qty: 1 }),
      });

      if (res.status === 401) {
        // 🚦 Not logged in → redirect to login
        router.push("/dashboard"); // or /auth if you have a login page
        return;
      }

      if (!res.ok) throw new Error("Failed to add to cart");

      // 🔔 Notify navbar
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-6">
      {/* Quantity */}
      <div className="flex items-center border rounded-md overflow-hidden">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty === 1}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
        >
          −
        </button>

        <span className="px-4 min-w-[40px] text-center">
          {qty}
        </span>

        <button
          onClick={() => setQty((q) => Math.min(stock, q + 1))}
          disabled={qty === stock}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
        >
          +
        </button>
      </div>

      {/* Add to Cart */}
      <button
        disabled={stock === 0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAddToCart(productId);
        }}
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
      >
        Add to cart
      </button>

    </div>
  );
}
