"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Product = {
  _id: string;
  title: string;
  price: number;
  sale_price?: number;
  images: string[];
};

export default function ProductGrid({
  products,
}: {
  products: Product[];
}) {
  const router = useRouter();

  const handleAddToCart = async (productId: string) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, qty: 1 }),
      });

      if (res.status === 401) {
        router.push("/dashboard"); // or /login
        return;
      }

      if (!res.ok) throw new Error("Failed to add to cart");

      // 🔔 Update navbar cart count
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => {
        const mainImage =
          product.images?.[0] || "/placeholder.png";
        const hoverImage =
          product.images?.[1] || mainImage;

        return (
          <Link
            key={product._id}
            href={`/products/${product._id}`}
            className="group block"
          >
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              {product.sale_price && (
                <span className="absolute top-4 left-4 bg-white text-xs px-2 py-1 rounded-lg shadow z-10">
                  Sale!
                </span>
              )}

              {/* Main Image */}
              <Image
                src={mainImage}
                alt={product.title}
                width={400}
                height={400}
                className="object-contain w-full h-72 transition-opacity duration-500 group-hover:opacity-0"
              />

              {/* Hover Image */}
              <Image
                src={hoverImage}
                alt={product.title}
                width={400}
                height={400}
                className="object-contain w-full h-72 absolute top-0 left-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              {/* Add to Cart */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product._id);
                }}
                className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
                aria-label="Add to Cart"
              >
                🛒
              </button>
            </div>

            <h3 className="mt-3 text-sm font-semibold line-clamp-2">
              {product.title}
            </h3>

            <div className="mt-1">
              {product.sale_price ? (
                <>
                  <span className="text-gray-400 line-through mr-2">
                    ${product.price}
                  </span>
                  <span className="font-bold">
                    ${product.sale_price}
                  </span>
                </>
              ) : (
                <span className="font-bold">${product.price}</span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
