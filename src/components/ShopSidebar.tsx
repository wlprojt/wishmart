// src/components/ShopSidebar.tsx
"use client";

import ShopPriceFilter from "./ShopPriceFilter";

const categories = [
  "Air conditioner",
  "Audio & video",
  "Gadgets",
  "Home appliances",
  "Kitchen appliances",
  "PCs & laptop",
  "Refrigerator",
  "Smart home",
];

export default function ShopSidebar() {
  return (
    <aside className="border-r pr-6">
      {/* Categories */}
      <h3 className="font-semibold text-lg mb-4">Categories</h3>
      <ul className="space-y-3 text-gray-600 mb-6">
        {categories.map((cat) => (
          <li
            key={cat}
            className="cursor-pointer hover:text-blue-600"
          >
            {cat}
          </li>
        ))}
      </ul>

      <ShopPriceFilter />
    </aside>
  );
}
