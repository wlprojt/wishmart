// src/components/ShopHeader.tsx
import SortDropdown from "./SortDropdown";

export default function ShopHeader({
  total,
  page,
}: {
  total: number;
  page: number;
}) {
  const start = (page - 1) * 12 + 1;
  const end = Math.min(page * 12, total);

  return (
    <div className="mb-8">
      <h1 className="text-5xl font-bold text-blue-600">
        Shop
      </h1>

      <div className="flex justify-between items-center mt-6 text-gray-500">
        <p>
          Showing {start}–{end} of {total} results
        </p>

        <SortDropdown />
      </div>
    </div>
  );
}
