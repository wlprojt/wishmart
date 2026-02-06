"use client";

import Image from "next/image";
import { useState } from "react";
import RelatedProducts from "./RelatedProducts";

export default function ProductTabs({
  description,
  images,
  title,
}: {
  description: string;
  images: string[];
  title: string;
}) {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );
  const [activeImage, setActiveImage] = useState(images[0]);
  

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="border-b flex gap-8">
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-3 text-sm font-semibold relative
            ${
              activeTab === "description"
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-800"
            }
          `}
        >
          Description
          {activeTab === "description" && (
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 text-sm font-semibold relative
            ${
              activeTab === "reviews"
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-800"
            }
          `}
        >
          Reviews (0)
          {activeTab === "reviews" && (
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-600" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="pt-10 max-w-7xl lg:mx-auto mx-4 mt-8">
        {activeTab === "description" && (
          <>
            <h2 className="text-4xl font-semibold text-gray-900 mb-4">
              More about the product
            </h2>

            <p className="text-gray-600 leading-relaxed mb-8">
              {description}
            </p>

            <section className="relative w-full overflow-hidden">
                {/* Image */}
                <div className="relative h-[420px] sm:h-[520px] w-full">
                    <Image
                    src={activeImage}
                    alt={title}
                    fill
                    priority
                    className="object-contain pt-12"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-200/40 to-gray-500/90" />
                </div>

                {/* Text Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 text-center px-6">
                    <p className="text-xs tracking-widest uppercase text-gray-200 mb-3">
                    Nunc sed justo
                    </p>

                    <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white max-w-4xl leading-relaxed">
                    Cras vehicula semper ex, et fermentum tortor varius eget interdum et
                    malesuada fames ac ante tellus eget.
                    </h1>

                    {/* Divider */}
                    <span className="mt-6 block w-12 h-[2px] bg-white/70" />
                </div>
            </section>

          </>
        )}

        {activeTab === "reviews" && (
          <p className="text-gray-600 text-2sm">
            There are no reviews yet.
          </p>
        )}

        <h2 className="text-4xl font-semibold text-gray-900 my-8">
              Related products
        </h2>

      </div>
    </div>
  );
}
