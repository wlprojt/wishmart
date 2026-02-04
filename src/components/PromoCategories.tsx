import Image from "next/image";

type PromoItem = {
  title: string;
  priceText: string;
  image: string;
  bg: string;
};

const promos: PromoItem[] = [
  {
    title: "Wireless headphones",
    priceText: "Starting at $49",
    image: "/headphone.png",
    bg: "bg-[#e7ecec]",
  },
  {
    title: "Grooming",
    priceText: "Starting at $49",
    image: "/treamer.png",
    bg: "bg-[#e9efef]",
  },
  {
    title: "Video games",
    priceText: "Starting at $49",
    image: "/games.png",
    bg: "bg-[#fff1d6]",
  },
];

export default function PromoCategories() {
  return (
    <div className="max-w-7xl lg:mx-auto mx-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promos.map((item, index) => (
          <div
            key={index}
            className={`${item.bg} rounded-xl shadow-sm p-6 flex justify-between items-center`}
          >
            {/* Text */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-500 mt-2">{item.priceText}</p>
              <button className="mt-4 text-blue-600 font-medium hover:underline">
                Shop now
              </button>
            </div>

            {/* Image */}
            <div className="relative w-32 h-40 shrink-0">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
