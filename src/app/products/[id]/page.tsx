

import Image from "next/image";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductActions from "@/components/ProductActions";
import ProductTabs from "@/components/ProductTabs";
import RelatedProducts from "@/components/RelatedProducts";

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ unwrap params

  await connectDB();

  const product = await Product.findById(id).lean();
  if (!product) return notFound();

  const relatedProducts = await Product.find({
  _id: { $ne: product._id },          // ❌ exclude current product
  category: product.category,         // ✅ same category
})
  
const normalizedRelatedProducts = relatedProducts.map((p) => ({
  _id: p._id.toString(),
  title: p.title,
  price: p.price,
  sale_price: p.sale_price ?? null,
  images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ["/placeholder.png"],
  rating: p.rating ?? 0,
  rating_count: p.rating_count ?? 0,
}));




  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT: Images */}
        <ProductImageGallery
          images={product.images}
          title={product.title}
          sale_price={product.sale_price}
        />


        {/* RIGHT: Details */}
        <div>
          <p className="text-sm text-gray-500 mb-2">
            Home / {product.category}
          </p>

          <h1 className="text-2xl font-bold text-gray-900">
            {product.title}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3 mt-4">
            {product.sale_price && (
              <span className="text-gray-400 line-through text-lg">
                ${product.price}
              </span>
            )}
            <span className="text-2xl font-bold text-gray-900">
              ${product.sale_price || product.price}
            </span>
          </div>

          {product.stock > 0 ? (
          <p className="mt-2 text-sm text-green-600 font-semibold">
            ✅ In stock ({product.stock} available)
          </p>
        ) : (
          <p className="mt-2 text-sm text-red-600 font-semibold">
            ❌ Out of stock
          </p>
        )}


          {/* Description */}
          <p className="text-gray-600 mt-4">
            {product.description}
          </p>

          <p className="text-gray-600 font-bold mt-4">
            Key features
          </p>

          {/* Features */}
          {product.features?.length > 0 && (
            <ul className="list-disc ml-5 mt-4 text-gray-600">
              {product.features.map((f: string, i: number) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}

          {/* Quantity + Cart */}
          <ProductActions stock={product.stock} productId={product._id.toString()} />

          <hr className="my-4" />

          {/* Category */}
          <p className="mt-6 text-sm">
            Category:{" "}
            <span className="text-blue-600">{product.category}</span>
          </p>

          <div className="relative mt-8">
            {/* Title */}
            <p className="absolute left-1/2 -top-3 -translate-x-1/2 bg-white px-3 text-2sm font-semibold text-gray-700">
              Guaranteed Safe Checkout
            </p>

            {/* Box */}
            <div className="border rounded-lg px-6 py-6">
              <div className="flex items-center justify-center">
                <Image
                  src="/lpayment.png"
                  alt="Payment methods"
                  width={220}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      <ProductTabs description={product.description} images={product.images} title={product.title} />
      <RelatedProducts products={normalizedRelatedProducts} />


    </div>
  );
}
