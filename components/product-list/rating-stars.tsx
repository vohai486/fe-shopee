import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import * as React from "react";

export function RatingStars({
  query,
  pathName = "/",
  nameRating,
}: {
  query: ParsedUrlQuery;
  pathName?: string;
  nameRating: string;
}) {
  if (!query) return null;
  return (
    <div className="py-4 text-sm text-black inline-block border-bottom">
      <div className="mb-1">Đánh giá</div>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Link
            href={{
              pathname: pathName,
              query: { ...query, ratingFilter: 5 - i },
            }}
            key={i}
            className={`flex items-center  gap-x-2 py-1 px-2 ${
              Number(query.ratingFilter) === 5 - i && " bg-gray1 rounded-xl"
            }`}
          >
            <div className="rating rating-sm gap-x-1">
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <input
                    type="radio"
                    key={idx}
                    name={`${nameRating}-${i}`}
                    className="mask mask-star-2 bg-yellow h-4 w-4"
                    checked={5 - i - 1 === idx}
                    onChange={() => {}}
                  />
                ))}
            </div>
            <span>{5 - i < 5 && "trở lên"}</span>
          </Link>
        ))}
    </div>
  );
}
