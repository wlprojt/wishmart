"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GooeyNav from "@/components/GooeyNav";
import { useRouter } from "next/navigation";

export default function ProductsAdminPage({ session }: { session: any }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // ✅ Redirect correctly
  // useEffect(() => {
  //   if (!session) {
  //     router.push("/login");
  //   }
  // }, [session, router]);

  // if (!session) return null;

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    const res = await fetch(`/api/admin/${id}`, { method: "DELETE" });

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  const items = [
    { label: "Home", href: "/admin/products" },
    { label: "View Product", href: "/admin/products/view-product" },
    { label: "Add Product", href: "/admin/products/add-product" },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-white mt-10">
        Loading...
      </p>
    );
  }

  // ⭐ EMPTY STATE
  if (products.length === 0) {
    return (
      <>
        <Nav items={items} />

        <div className="flex flex-col items-center justify-center h-[70vh]">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076409.png"
            className="w-40 opacity-80 invert"
            alt="No products"
          />

          <h2 className="text-2xl text-gray-200 font-semibold mt-4">
            No Products Found
          </h2>

          <p className="text-gray-500 mt-1">
            Start by adding your first product
          </p>

          <Link
            href="/admin/products/add-product"
            className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            + Add Product
          </Link>
        </div>
      </>
    );
  }

  // ⭐ PRODUCT LIST
  return (
    <>
      <Nav items={items} />

      <div className="bg-[#29293d] w-full min-h-screen pb-10">
      <div className="max-w-5xl mx-auto mt-10">
        <h1 className="text-gray-200 text-3xl font-bold mb-10 text-center">
          All Products
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
            key={product._id}
            className="p-5 bg-white shadow-md rounded-lg border"
          >
            <div className="flex gap-3 overflow-x-auto">
              {(product.images ?? []).map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  className="w-28 h-24 object-cover rounded border"
                  alt={product.title ?? "Product"}
                />
              ))}
            </div>

            <h2 className="text-xl font-semibold mt-3">{product.title}</h2>

            {/* Price */}
            <div className="mt-2">
              {product.sale_price ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through text-sm">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-gray-900 font-semibold">
                    ${product.sale_price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-gray-900 font-semibold">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500">{product.category}</p>

            {/* ⭐ Features */}
            {product.features?.length > 0 && (
              <ul className="mt-2 text-gray-700 list-disc list-inside">
                {product.features.map((f: string, i: number) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}

            <div className="flex justify-between mt-4">
              <Link
                href={`/admin/products/${product._id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Edit
              </Link>

              <button
                onClick={() => deleteProduct(product._id)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>

          ))}
        </div>
      </div>
      </div>
    </>
  );
}

/* 🔹 Extracted Nav for cleanliness */
function Nav({ items }: { items: any[] }) {
  return (
    <div
      className="flex bg-[#29293d] items-center justify-center pt-15 mb-20"
      style={{ height: "0px", position: "relative" }}
    >
      <GooeyNav
        items={items}
        particleCount={15}
        particleDistances={[90, 10]}
        particleR={100}
        initialActiveIndex={1}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
      />
    </div>
  );
}
