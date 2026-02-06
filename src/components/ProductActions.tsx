"use client";

import { useState } from "react";

export default function ProductActions({
  stock,
}: {
  stock: number;
}) {
  const [qty, setQty] = useState(1);

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
        onClick={() => {
          console.log("Add to cart", { qty });
        }}
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Add to cart
      </button>
    </div>
  );
}
