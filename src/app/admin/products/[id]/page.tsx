"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [salePrice, setSalePrice] = useState<number | string>("");
  const [images, setImages] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState<number | string>("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // --------------- Fetch Product ---------------
  const fetchProduct = async () => {
    const res = await fetch(`/api/admin/${id}`);
    const data = await res.json();

    setTitle(data.title);
    setPrice(data.price);
    setSalePrice(data.sale_price ?? "");
    setImages(data.images?.length ? data.images : [""]);
    setFeatures(data.features?.length ? data.features : [""]);
    setDescription(data.description);
    setCategory(data.category);
    setStock(data.stock);
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  // --------------- Image Functions ---------------
  const handleImageChange = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };
  const addImageField = () => setImages([...images, ""]);
  const removeImageField = (i: number) => setImages(images.filter((_, idx) => idx !== i));

  // --------------- Features Functions ---------------
  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };
  const addFeatureField = () => setFeatures([...features, ""]);
  const removeFeatureField = (i: number) => setFeatures(features.filter((_, idx) => idx !== i));

  // --------------- Update Product ---------------
  const updateProduct = async (e: any) => {
    e.preventDefault();
    setUpdating(true);

    // --- Validation ---
    if (!title.trim() || !description.trim() || !category.trim()) {
      alert("Title, description, and category are required");
      setUpdating(false);
      return;
    }
    if (Number(price) <= 0 || Number(stock) < 0) {
      alert("Price must be positive and stock cannot be negative");
      setUpdating(false);
      return;
    }
    if (salePrice && Number(salePrice) < 0) {
      alert("Sale price cannot be negative");
      setUpdating(false);
      return;
    }
    if (images.some((img) => !img.trim())) {
      alert("Image URLs cannot be empty");
      setUpdating(false);
      return;
    }
    if (features.some((f) => !f.trim())) {
      alert("Features cannot be empty");
      setUpdating(false);
      return;
    }

    // --- API call ---
    const res = await fetch(`/api/admin/${id}`, {
      method: "PUT",
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

    if (res.ok) {
      alert("Product Updated Successfully!");
      router.push("/admin/products/view-product");
    } else {
      const errData = await res.json();
      alert(errData.message || "Failed to update product");
    }

    setUpdating(false);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Product</h1>

      <form onSubmit={updateProduct} className="space-y-5">

        {/* Title */}
        <input
          className="w-full p-3 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product Title"
          required
        />

        {/* Price */}
        <input
          className="w-full p-3 border rounded"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          required
        />

        {/* Sale Price */}
        <input
          className="w-full p-3 border rounded"
          type="number"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          placeholder="Sale Price (optional)"
        />

        {/* Images */}
        <div>
          <label className="font-semibold">Image URLs</label>
          {images.map((img, index) => (
            <div key={index} className="flex items-center gap-3 mt-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={`Image URL ${index + 1}`}
                  className="w-full p-3 border rounded-lg"
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                />
                {img && (
                  <img
                    src={img}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="w-28 h-20 object-cover rounded mt-2 border"
                    alt="Preview"
                  />
                )}
              </div>
              {images.length > 1 && (
                <button type="button" className="p-2 bg-red-500 text-white rounded"
                  onClick={() => removeImageField(index)}>✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addImageField}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">
            + Add Another Image
          </button>
        </div>

        {/* Features */}
        <div>
          <label className="font-semibold">Features</label>
          {features.map((f, index) => (
            <div key={index} className="flex items-center gap-3 mt-3">
              <input
                type="text"
                placeholder={`Feature ${index + 1}`}
                className="w-full p-3 border rounded-lg"
                value={f}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
              />
              {features.length > 1 && (
                <button type="button" className="p-2 bg-red-500 text-white rounded"
                  onClick={() => removeFeatureField(index)}>✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addFeatureField}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">
            + Add Another Feature
          </button>
        </div>

        {/* Category */}
        <input
          className="w-full p-3 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        />

        {/* Stock */}
        <input
          className="w-full p-3 border rounded"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
          required
        />

        {/* Description */}
        <textarea
          className="w-full p-3 border rounded"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded text-lg"
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
