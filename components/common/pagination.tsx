import * as React from "react";

export interface PaginationProps {
  page?: number;
  total_pages?: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
}

export function Pagination({
  page,
  total_pages,
  handlePrevPage,
  handleNextPage,
}: PaginationProps) {
  if (!page || !total_pages) return null;
  return (
    <div className="flex items-center">
      <div className="mr-4">
        <span className="text-orange">{page}</span>
        <span>/{total_pages}</span>
      </div>
      <button
        onClick={handlePrevPage}
        className={`h-8 w-8 bg-white flex border border-gray items-center justify-center ${
          page <= 1 && "cursor-default bg-gray pointer-events-none"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        onClick={handleNextPage}
        className={`h-8 w-8 bg-white flex border border-gray items-center justify-center ${
          +page === +total_pages && "cursor-default bg-gray pointer-events-none"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}
