import Image from "next/image";

const brands = [
  { name: "Brand 1", logo: "/brand1.svg" },
  { name: "Brand 2", logo: "/brand2.svg" },
  { name: "Brand 3", logo: "/brand3.svg" },
  { name: "Brand 4", logo: "/brand4.svg" },
  { name: "Brand 5", logo: "/brand5.svg" },
  { name: "Brand 6", logo: "/brand6.svg" },
];

export default function TopBrands() {
  return (
    <div className="max-w-7xl lg:mx-auto mx-4 my-8">
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Top brands
      </h2>

      {/* Brand Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border border-gray-300 rounded-lg shadow-sm overflow-hidden bg-[#e6ecec]">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="flex items-center justify-center h-24 lg:h-30 border-r border-b border-gray-300
                       last:border-r-0 lg:[&:nth-child(6n)]:border-r-0
                       sm:[&:nth-child(6n)]:border-r-0"
          >
            <div className="relative h-10 w-28">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain opacity-90"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
