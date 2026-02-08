"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ShopPriceFilter() {
  const MIN = 0;
  const MAX = 2000;

  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(MIN);
  const [maxPrice, setMaxPrice] = useState(MAX);
  const [mounted, setMounted] = useState(false);

  // ✅ Hook 1
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Hook 2 (must always run)
  useEffect(() => {
    if (!mounted) return;

    setMinPrice(Number(searchParams.get("minPrice") || MIN));
    setMaxPrice(Number(searchParams.get("maxPrice") || MAX));
  }, [searchParams, mounted]);

  // ✅ Safe early return AFTER hooks
  if (!mounted) return null;

  const applyFilter = () => {
  const params = new URLSearchParams(searchParams.toString());

  params.set("minPrice", minPrice.toString());
  params.set("maxPrice", maxPrice.toString());
  params.set("page", "1");

  router.push(`/shop?${params.toString()}`);
};

  const resetFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Filter by price</h3>

      <div className="relative h-2">
        <div className="absolute w-full h-1 bg-gray-300 rounded top-1/2 -translate-y-1/2" />

        <div
          className="absolute h-1 bg-blue-600 rounded top-1/2 -translate-y-1/2"
          style={{
            left: `${(minPrice / MAX) * 100}%`,
            right: `${100 - (maxPrice / MAX) * 100}%`,
          }}
        />

        <input
          type="range"
          min={MIN}
          max={MAX}
          value={minPrice}
          onChange={(e) =>
            setMinPrice(Math.min(+e.target.value, maxPrice - 1))
          }
          className="range-input z-20"
        />

        <input
          type="range"
          min={MIN}
          max={MAX}
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(Math.max(+e.target.value, minPrice + 1))
          }
          className="range-input z-30"
        />
      </div>

      <div className="flex gap-4">
        <div className="border px-4 py-2 w-24">${minPrice}</div>
        <div className="border px-4 py-2 w-24">${maxPrice}</div>
      </div>

      <div className="flex gap-3">
        <button
          className="bg-slate-800 text-white px-6 py-3 font-semibold"
          onClick={applyFilter}
        >
          Apply
        </button>

        <button
          className="border px-6 py-3 font-semibold"
          onClick={resetFilter}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
