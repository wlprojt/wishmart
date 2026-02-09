import Image from "next/image";
import Link from "next/link";

export default function BrandDealBanner() {
  return (
    <div className="max-w-7xl lg:mx-auto mx-4 my-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
        
        {/* Left Content */}
        <div className="p-8 lg:p-14">
          <p className="text-sm tracking-widest text-gray-500 uppercase mb-4">
            Brand’s deal
          </p>

          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Save up to $200 on select <br />
            Samsung washing machine
          </h2>

          <p className="text-gray-500 mt-5 max-w-md">
            Tortor purus et quis aenean tempus tellus fames.
          </p>

          <Link href="/shop?category=Home+appliances&page=1" className="mt-6 text-blue-600 font-semibold hover:underline">
            Shop now
          </Link>
        </div>

        {/* Right Image */}
        <div className="relative w-full h-[280px] sm:h-[360px] lg:h-full">
          <Image
            src="/washing_machine.jpg"
            alt="Samsung Washing Machine"
            fill
            className="object-cover"
            priority
          />
        </div>

      </div>
    </div>
  );
}
