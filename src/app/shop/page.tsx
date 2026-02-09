// src/app/shop/page.tsx
import ShopSidebar from "@/components/ShopSidebar";
import ShopHeader from "@/components/ShopHeader";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";

type SearchParams = {
  category?: string;
  page?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
};

async function getProducts(
  category?: string,
  page = 1,
  sort?: string,
  minPrice?: string,
  maxPrice?: string
) {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products/all`
  );

  url.searchParams.set("page", String(page));

if (category) url.searchParams.set("category", category);
if (sort) url.searchParams.set("sort", sort);
if (minPrice) url.searchParams.set("minPrice", minPrice);
if (maxPrice) url.searchParams.set("maxPrice", maxPrice);


  const res = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
}

export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const page = Number(params.page || 1);

  const data = await getProducts(
    params.category,
    page,
    params.sort,
    params.minPrice,
    params.maxPrice
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
        <ShopSidebar />

        <div>
          <ShopHeader title={params.category || "All Products"} total={data.total} page={page} />
          <ProductGrid products={data.products} />
          <Pagination page={page} pages={data.pages} />
        </div>
      </div>
    </div>
  );
}
