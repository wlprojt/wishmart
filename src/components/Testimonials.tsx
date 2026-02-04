import Image from "next/image";

type Review = {
  name: string;
  text: string;
  avatar: string;
};

const reviews: Review[] = [
  {
    name: "Rafael Stokes",
    text: "Amazing service and fast delivery! Got my new phone in perfect condition. Will definitely shop here again!",
    avatar: "/user1.jpeg",
  },
  {
    name: "Chelsea Turner",
    text: "Highly recommend! My laptop arrived ahead of time and customer care was super helpful.",
    avatar: "/user2.jpeg",
  },
  {
    name: "Jacqueline Mueller",
    text: "Quality products, fair prices, and lightning-fast delivery. My go-to electronics store!",
    avatar: "/user3.jpeg",
  },
  {
    name: "Olive Borer",
    text: "Smooth experience from browsing to delivery. Great deals and genuine gadgets!",
    avatar: "/user4.jpeg",
  },
  {
    name: "Priscilla Jacobson",
    text: "Impressed with the range and support. Bought a smart TV and the setup help was a bonus!",
    avatar: "/user5.jpeg",
  },
  {
    name: "Joseph Reinger",
    text: "Authentic products and great after-sales service. A reliable store for all electronics!",
    avatar: "/user6.jpeg",
  },
];

export default function Testimonials() {
  return (
    <div className="max-w-7xl lg:mx-auto mx-4 pb-8">
      {/* Heading */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        What is everyone saying?
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            {/* Stars */}
            <div className="flex gap-1 text-yellow-400 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>

            {/* Review */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {review.text}
            </p>

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-medium text-gray-800">
                {review.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
