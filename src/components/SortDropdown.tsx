// src/components/SortDropdown.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const options = [
  { label: "Default sorting", value: "" },
  { label: "Sort by popularity", value: "popularity" },
  { label: "Sort by average rating", value: "rating" },
  { label: "Sort by latest", value: "latest" },
  { label: "Sort by price: low to high", value: "price-asc" },
  { label: "Sort by price: high to low", value: "price-desc" },
];

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = searchParams.get("sort") || "";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set("sort", value);
    else params.delete("sort");

    params.set("page", "1"); // reset pagination
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className= "bg-gray-50 text-gray-800 text-sm px-4 py-2 rounded-md focus:outline-none"
    >
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          className="bg-gray-700"
        >
          {opt.label}
        </option>
      ))}
    </select>
  );
}
