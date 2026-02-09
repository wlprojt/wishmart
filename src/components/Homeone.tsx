
import { FaShippingFast } from "react-icons/fa";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { GiReturnArrow } from "react-icons/gi";
import { IoIosCard } from "react-icons/io";
import Image from 'next/image'
import Link from 'next/link'
import { IconType } from "react-icons";

const Homeone = () => {
  return (
    <>
    <div className="relative md:h-172 h-135 w-full">
      <Image
        src="/hcimg.jpg"
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      <div className="relative z-10 flex max-w-7xl h-full mx-auto p-8 md:p-4 justify-end items-end md:items-center">
        <div className='p-10 md:h-100 w-full md:w-100 bg-white rounded-lg shadow-lg'>
            {/* Logo */}
          <Image
            src="/logoipsum.svg"
            alt="Logo"
            width={100}
            height={10}
          />

          {/* Title */}
          <h1 className="mt-4 md:mt-6 text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
            The best home entertainment system is here
          </h1>

          {/* Description */}
          <p className="mt-4 md:mt-6 text-gray-600">
            Sit diam odio eget rhoncus volutpat est nibh velit posuere egestas.
          </p>

          {/* CTA */}
          <Link
            href="/shop?category=Audio+%26+video&page=1"
            className="inline-block mt-4 md:mt-6 text-blue-600 font-semibold hover:underline"
          >
            Shop now →
          </Link>
        </div>
      </div>
    </div>

    <div className="m-4 min-w-50 max-w-7xl lg:mx-auto bg-white border border-gray-300 md:-mt-13 relative z-10 rounded-lg shadow-sm">
        <div className="px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <Feature icon={FaShippingFast} title="Free shipping" desc="When you spend $80 or more" bordered={true} />
          <Feature icon={BiSolidMessageRoundedDots} title="We are available 24/7" desc="Need help? Contact us anytime" bordered={true} />
          <Feature icon={GiReturnArrow} title="Satisfied or return" desc="Easy 30-day return policy" bordered={true} />
          <Feature icon={IoIosCard} title="100% secure payments" desc="Visa, Mastercard, Stripe, PayPal" />
        </div>
      </div>

      </>
  )
}

function Feature({ icon: Icon, title, desc, bordered = false}: { icon: IconType; title: string; desc: string; bordered?: boolean }) {
  return (
    <div className={`sm:flex  items-start gap-4 md:p-6 ${
        bordered ? "md:border-r md:border-gray-200" : ""
      }`}>
      {/* Icon */}
      <div className="text-blue-600">
        <Icon className="w-6 h-6" />
      </div>

      {/* Text */}
      <div className="flex-col">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-gray-500 text-sm mt-1">{desc}</p>
      </div>
    </div>
  );
}

export default Homeone