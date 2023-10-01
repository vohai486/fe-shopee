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
    <div className="text-sm inline-block">
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
            className={`flex items-center  gap-x-2 py-1 px-2 border rounded-xl ${
              Number(query.ratingFilter) === 5 - i
                ? " border-blue-200 "
                : "border-transparent"
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
                    className="mask mask-star-2 bg-yellow-0  dark:bg-yellow-100 "
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
