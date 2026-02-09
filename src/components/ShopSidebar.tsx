"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <aside className="border-r pr-6">
      {/* Categories */}
      <h3 className="font-semibold text-lg mb-4">Categories</h3>

      <ul className="space-y-3 text-gray-600 mb-6">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;

          return (
            <li key={cat}>
              <Link
                href={{
                  pathname: "/shop",
                  query: { category: cat, page: 1 },
                }}
                className={`block hover:text-blue-600 transition
                  ${isActive ? "text-blue-600 font-semibold" : ""}
                `}
              >
                {cat}
              </Link>
            </li>
          );
        })}
      </ul>

      <ShopPriceFilter />
    </aside>
  );
}
