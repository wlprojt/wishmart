import Image from "next/image";
import GoldenStarRating from "./GoldenStarRating";

type Product = {
  _id: string;
  title: string;
  price: number;
  sale_price?: number | null;
  images: string[];
  rating?: number;
  rating_count?: number;
};

type Props = {
  products: Product[];
};

export default function HomeAppliances({ products }: Props) {
  if (!products.length) return null;

  const displayedProducts = products.slice(0, 4);

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Home Appliances</h2>
        <a href="/category/home-appliances" className="text-blue-600 font-medium">
          See more
        </a>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product) => {
          const mainImage = product.images[0];
          const hoverImage = product.images[1] ?? product.images[0];

          return (
            <div key={product._id} className="group relative">
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
                  className="object-contain w-full h-70 transition-opacity duration-700 group-hover:opacity-0"
                />

                {/* Hover Image */}
                {product.images[1] && (
                  <Image
                    src={hoverImage}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="object-contain w-full h-70 absolute top-0 left-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                )}

                {/* Add to Cart Button */}
                <button
                  className="absolute bottom-4 right-4 bg-gray-50 text-gray-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                  aria-label="Add to Cart"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                    >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                  </svg>

                </button>
              </div>

              {/* Rating */}
              <div className="mt-1 flex items-center gap-2">
                <GoldenStarRating value={product.rating ?? 0} />
                <span className="text-xs text-gray-500">
                  ({product.rating_count ?? 0})
                </span>
              </div>

              <h3 className="mt-3 text-sm font-semibold line-clamp-2">
                {product.title}
              </h3>

              <div className="mt-1 mb-10">
                {product.sale_price ? (
                  <>
                    <span className="text-gray-400 line-through mr-2">
                      ${product.price}
                    </span>
                    <span className="font-bold">${product.sale_price}</span>
                  </>
                ) : (
                  <span className="font-bold">${product.price}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
