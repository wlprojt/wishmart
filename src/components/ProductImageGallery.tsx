"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Search } from "lucide-react";

export default function ProductImageGallery({
  images,
  title,
  sale_price,
}: {
  images: string[];
  title: string;
  sale_price?: null | number;
}) {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  const showSale = typeof sale_price === "number";

  const openModal = () => {
    setOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = () =>
    setActiveIndex((i) => (i + 1) % images.length);

  const prevImage = () =>
    setActiveIndex((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    setActiveImage(images[activeIndex]);
  }, [activeIndex, images]);


  return (
    <>
    <div>
      {/* MAIN IMAGE */}
      <div
        className="relative bg-gray-50 rounded-lg p-4 overflow-hidden hidden md:block group"
        onMouseMove={handleMove}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => {
          setZoom(false);
          setPos({ x: 50, y: 50 });
        }}
      >
        {/* SALE BADGE */}
        {showSale && (
          <span className="absolute top-8 left-8 z-10 bg-white/90 text-gray-800 text-xs px-3 py-1 rounded-full shadow">
            Sale!
          </span>
        )}

        {/* MAGNIFY ICON */}
        <div
          onClick={openModal}
          className="absolute top-8 right-8 z-10 bg-white/90 p-2 rounded-full shadow transition"
        >
          <Search size={18} className="text-gray-700" />
        </div>

        <Image
          src={activeImage}
          alt={title}
          width={600}
          height={600}
          priority
          className="w-full h-auto transition-transform duration-300"
          style={{
            transform: zoom ? "scale(1.6)" : "scale(1)",
            transformOrigin: `${pos.x}% ${pos.y}%`,
          }}
        />
      </div>

      {/* MOBILE IMAGE */}
      <div className="relative md:hidden bg-gray-50 rounded-lg p-4">
        {showSale && (
          <span className="absolute top-6 left-6 z-10 bg-white/90 text-gray-800 text-xs px-3 py-1 rounded-full shadow">
            Sale!
          </span>
        )}

        {/* MAGNIFY ICON (always visible on mobile) */}
        <div 
          className="absolute top-6 right-6 z-10 bg-white/90 p-2 rounded-full shadow"
          onClick={openModal}
        >
          <Search size={18} className="text-gray-700" />
        </div>

        <Image
          src={activeImage}
          alt={title}
          width={600}
          height={600}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 mt-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(img)}
            className={`border rounded-md p-1 transition
              ${
                activeImage === img
                  ? "ring-2 ring-blue-500"
                  : "hover:ring-2 hover:ring-gray-300"
              }`}
          >
            <Image
              src={img}
              alt="thumb"
              width={80}
              height={80}
              className="object-cover rounded"
            />
          </button>
        ))}
      </div>
    </div>

    {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          {/* CLOSE */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-white"
          >
            <X size={28} />
          </button>

          {/* COUNTER */}
          <div className="absolute top-6 left-6 text-white text-sm">
            {activeIndex + 1} / {images.length}
          </div>

          {/* PREV */}
          <button
            onClick={prevImage}
            className="absolute left-6 text-white"
          >
            <ChevronLeft size={40} />
          </button>

          {/* IMAGE */}
          <Image
            src={images[activeIndex]}
            alt={title}
            width={900}
            height={900}
            className="max-h-[85vh] w-auto object-contain"
          />

          {/* NEXT */}
          <button
            onClick={nextImage}
            className="absolute right-6 text-white"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </>
  );
}
