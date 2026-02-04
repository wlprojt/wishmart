"use client";

import GooeyNav from "@/components/GooeyNav";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Session {
  user?: {
    email?: string;
    name?: string;
  };
}

export default function AddProductPage({ session }: { session: Session }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [salePrice, setSalePrice] = useState<number | string>("");
  const [images, setImages] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState<number | string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ Admin redirect
  // useEffect(() => {
  //   const ADMIN_EMAIL = "rakeshvishwas730@gmail.com";
  //   if (!session || session.user?.email !== ADMIN_EMAIL) {
  //     router.replace("/"); // redirect non-admins
  //   }
  // }, [session, router]);

  // --- Images ---
  const handleImageChange = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const addImageField = () => setImages([...images, ""]);
  const removeImageField = (index: number) =>
    setImages(images.filter((_, i) => i !== index));

  // --- Features ---
  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const addFeatureField = () => setFeatures([...features, ""]);
  const removeFeatureField = (index: number) =>
    setFeatures(features.filter((_, i) => i !== index));

  // --- Nav Items ---
  const items = [
    { label: "Home", href: "/admin/products" },
    { label: "View Product", href: "/admin/products/view-product" },
    { label: "Add Product", href: "/admin/products/add-product" },
  ];

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // --- Validation ---
    if (!title.trim() || !description.trim() || !category.trim()) {
      setError("Title, description, and category cannot be empty.");
      setLoading(false);
      return;
    }

    if (Number(price) <= 0 || Number(stock) < 0) {
      setError("Price must be positive and stock cannot be negative.");
      setLoading(false);
      return;
    }

    if (salePrice && Number(salePrice) < 0) {
      setError("Sale price cannot be negative.");
      setLoading(false);
      return;
    }

    if (images.some((img) => !img.trim())) {
      setError("Image URLs cannot be empty.");
      setLoading(false);
      return;
    }

    if (features.some((f) => !f.trim())) {
      setError("Features cannot be empty.");
      setLoading(false);
      return;
    }

    // --- API call ---
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price: Number(price),
          sale_price: salePrice ? Number(salePrice) : null,
          images,
          features,
          description,
          category,
          stock: Number(stock),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      alert("Product Added Successfully 🎉");

      // Reset form
      setTitle("");
      setPrice("");
      setSalePrice("");
      setImages([""]);
      setFeatures([""]);
      setDescription("");
      setCategory("");
      setStock("");

    } catch (err) {
      setError("Network error, try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex item-center justify-center bg-[#29293d] pt-10 pb-20" style={{ height: '0px', position: 'relative' }}>
        <GooeyNav
          items={items}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={2}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
      </div>

      <div className="pb-30 bg-[#29293d]">
        <div className="max-w-2xl mt-10 mx-auto p-6 bg-white shadow-xl rounded-xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>

          {error && (
            <p className="mb-4 text-red-600 font-medium text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <input type="text" placeholder="Product Title" className="w-full p-3 border rounded-lg"
              value={title} onChange={(e) => setTitle(e.target.value)} required />

            {/* Price */}
            <input type="number" placeholder="Price" className="w-full p-3 border rounded-lg"
              value={price} onChange={(e) => setPrice(e.target.value)} required />

            {/* Sale Price */}
            <input type="number" placeholder="Sale Price (optional)" className="w-full p-3 border rounded-lg"
              value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />

            {/* Images */}
            <div>
              <label className="font-semibold">Image URLs</label>
              {images.map((img, index) => (
                <div key={index} className="flex items-center gap-3 mt-3">
                  <div className="flex-1">
                    <input type="text" placeholder={`Image URL ${index + 1}`} className="w-full p-3 border rounded-lg"
                      value={img} onChange={(e) => handleImageChange(index, e.target.value)} required />
                    {img && (
                      <img src={img} onError={(e) => (e.currentTarget.style.display = "none")}
                        className="w-28 h-20 object-cover rounded mt-2 border" alt="Preview" />
                    )}
                  </div>
                  {images.length > 1 && (
                    <button type="button" className="p-2 bg-red-500 text-white rounded"
                      onClick={() => removeImageField(index)}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addImageField} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">
                + Add Another Image
              </button>
            </div>

            {/* Features */}
            <div>
              <label className="font-semibold">Features</label>
              {features.map((f, index) => (
                <div key={index} className="flex items-center gap-3 mt-3">
                  <input type="text" placeholder={`Feature ${index + 1}`} className="w-full p-3 border rounded-lg"
                    value={f} onChange={(e) => handleFeatureChange(index, e.target.value)} required />
                  {features.length > 1 && (
                    <button type="button" className="p-2 bg-red-500 text-white rounded"
                      onClick={() => removeFeatureField(index)}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addFeatureField} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">
                + Add Another Feature
              </button>
            </div>

            {/* Category */}
            <input type="text" placeholder="Category" className="w-full p-3 border rounded-lg"
              value={category} onChange={(e) => setCategory(e.target.value)} required />

            {/* Stock */}
            <input type="number" placeholder="Stock Quantity" className="w-full p-3 border rounded-lg"
              value={stock} onChange={(e) => setStock(e.target.value)} required />

            {/* Description */}
            <textarea placeholder="Product Description" className="w-full p-3 border rounded-lg" rows={4}
              value={description} onChange={(e) => setDescription(e.target.value)} required />

            {/* Submit */}
            <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg w-full font-semibold flex justify-center">
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
