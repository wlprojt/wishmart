"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  page: number;
  pages: number;
};

export default function Pagination({ page, pages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/shop?${params.toString()}`);
  };

  if (pages <= 1) return null;

  return (
    <div className="flex gap-3 mt-10">
      {/* Page numbers */}
      {Array.from({ length: pages }).map((_, i) => {
        const p = i + 1;
        const isActive = p === page;

        return (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`w-10 h-10 border text-sm font-medium transition
              ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-blue-600 text-blue-600 hover:bg-blue-50"
              }
            `}
          >
            {p}
          </button>
        );
      })}

      {/* Next */}
      {page < pages && (
        <button
          onClick={() => goToPage(page + 1)}
          className="w-10 h-10 border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
        >
          →
        </button>
      )}
    </div>
  );
}
