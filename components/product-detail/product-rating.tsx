import * as React from "react";

export interface IProductRatingProps {}

export function ProductRating({
  num,
  activeClass = "w-4 h-4 fill-yellow-100",
  nonActiveClass = "w-4 h-4 stroke-yellow-100 fill-grey-0",
}: {
  num: number;
  activeClass?: string;
  nonActiveClass?: string;
}) {
  const handleWidth = (index: number): number => {
    if (index <= num - 1) return 100;
    if (num - index < 1) return (index - num) * 100;
    return 0;
  };
  return (
    <div className="flex items-center gap-1">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div className="relative" key={i}>
            <div
              className={`absolute top-0 right-0 left-0 overflow-hidden`}
              style={{
                width: `${handleWidth(i)}%`,
              }}
            >
              <svg
                enableBackground="new 0 0 15 15"
                viewBox="0 0 15 15"
                x={0}
                y={0}
                className={activeClass}
              >
                <polygon
                  points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit={10}
                />
              </svg>
            </div>
            <svg
              enableBackground="new 0 0 15 15"
              viewBox="0 0 15 15"
              x={0}
              y={0}
              className={nonActiveClass}
            >
              <polygon
                fill="none"
                points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
              />
            </svg>
          </div>
        ))}
    </div>
  );
}
