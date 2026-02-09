import Image from 'next/image';
import Link from 'next/link';

type Category = {
  title: string;
  count: number;
  image: string;
};

const categories: Category[] = [
  { title: "Air conditioner", count: 4, image: "/ac.jpg" },
  { title: "Audio & video", count: 5, image: "/tv.jpg" },
  { title: "Gadgets", count: 6, image: "/phone.jpg" },
  { title: "Home appliances", count: 5, image: "/washing.jpg" },
  { title: "Kitchen appliances", count: 6, image: "/oven.jpg" },
  { title: "PCs & laptop", count: 4, image: "/laptop.jpg" },
  { title: "Refrigerator", count: 4, image: "/fridge.jpg" },
  { title: "Smart home", count: 5, image: "/smart.jpg" },
];

const Hometwo = () => {
  return (
    <>
    <div className='bg-white p-6 min-w-50 max-w-7xl lg:mx-auto mx-4 border border-gray-300 rounded-lg shadow-sm mt-8 mb-8'>
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Shop by Category
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 pb-10">
        {categories.map((cat) => (
          <Link
            key={cat.title}
            href={{
              pathname: "/shop",
              query: {
                category: cat.title,
                page: 1,
              },
            }}
            className="group flex flex-col items-center text-center"
          >
            <div className="relative w-40 h-40 md:w-60 md:h-60 flex items-center justify-center">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>

            <p className="relative z-10 -mt-8 md:-mt-13 font-bold text-gray-900 uppercase text-sm">
              {cat.title}
            </p>
            <span className="relative z-10 md:pb-10 text-xs font-bold text-gray-500">
              {cat.count} Products
            </span>
          </Link>
        ))}
      </div>
    </div>

    <div className='min-w-50 max-w-7xl lg:mx-auto mx-4 mt-8 mb-8'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Banner */}
        <PromoCard
          image="/sbgtwo.jpg"
          title="The only case you need."
          button="Shop Now"
        />

        {/* Right Banner */}
        <PromoCard
          image="/sbgone.jpg"
          title="Get 30% OFF"
          button="Shop Now"
        />

      </div>
    </div>
    </>
  )
}

function PromoCard({
  image,
  title,
  button,
}: {
  image: string;
  title: string;
  button: string;
}) {
  return (
    <div className="relative h-56 md:h-64 lg:h-72 rounded-xl shadow-lg overflow-hidden group">
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        priority
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-6">
        <h3 className="text-xl md:text-2xl font-semibold">
          {title}
        </h3>

        <div className="w-25 h-[2px] bg-white my-4" />

        <Link
          href="/shop?category=Gadgets&page=1"
          className="text-sm font-semibold tracking-wide hover:underline"
        >
          {button}
        </Link>
      </div>
    </div>
  );
}

export default Hometwo