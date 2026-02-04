import { Star, StarHalf } from "lucide-react";

type Props = {
  value: number; // 0 – 5 (e.g. 4.5)
};

export default function GoldenStarRating({ value }: Props) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        if (value >= star) {
          return (
            <Star
              key={star}
              size={14}
              className="fill-yellow-400 text-yellow-400"
            />
          );
        }

        if (value >= star - 0.5) {
          return (
            <StarHalf
              key={star}
              size={14}
              className="fill-yellow-400 text-yellow-400"
            />
          );
        }

        return (
          <Star
            key={star}
            size={14}
            className="text-yellow-400"
          />
        );
      })}
    </div>
  );
}
