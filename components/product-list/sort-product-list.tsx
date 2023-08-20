import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import * as React from "react";
import { Pagination } from "../common";

const filters = [
  {
    value: "pop",
    label: "Phổ biến",
  },
  {
    value: "ctime",
    label: "Mới nhất",
  },
  {
    value: "sales",
    label: "Bán chạy",
  },
];

export function SortProductList({
  query,
  page,
  total_pages,
  pathName = "/",
}: {
  query: ParsedUrlQuery;
  page: number;
  total_pages: number;
  pathName?: string;
}) {
  // sortBy
  const router = useRouter();
  const handleSort = (value: string) => {
    router.push({
      pathname: pathName,
      query: {
        ...query,
        sortBy: value,
      },
    });
  };
  const handleSortPrice = (value: string) => {
    router.push({
      pathname: pathName,
      query: {
        ...query,
        sortBy: "price",
        order: value,
      },
    });
  };
  const handlePrevPage = () => {
    if (+page <= 1) return;
    router.push({
      pathname: pathName,
      query: {
        ...query,
        page: +page - 1,
      },
    });
  };
  const handleNextPage = () => {
    if (page === total_pages) return;
    router.push({
      pathname: pathName,
      query: {
        ...query,
        page: +page + 1,
      },
    });
  };
  const { sortBy, order } = query;
  return (
    <div className="lg:px-5 py-3 lg:bg-gray1 text-sm lg:flex  justify-between">
      <div className="flex flex-col lg:flex-row gap-y-2  gap-x-3">
        <div className="my-auto">Sắp xếp theo</div>
        {filters.map((item) => (
          <button
            onClick={() => {
              handleSort(item.value);
            }}
            key={item.value}
            className={`h-8  rounded-sm text-left lg:text-center px-2 lg:px-3 ${
              item.value === sortBy && "bg-orange text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
        <div className="h-8 parent bg-gray lg:bg-white group  lg:w-[200px] relative after:w-full after:absolute cursor-pointer  after:h-2 after:-bottom-2 flex items-center justify-between">
          <span className={`ml-2 ${order && "text-orange"}`}>
            {order === "asc"
              ? " Giá: Thấp đến Cao"
              : order === "desc"
              ? "Giá: Cao đến Thấp"
              : "Giá"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="{1.5}"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
          <div className="w-full group-hover:block hidden z-10 bg-gray lg:bg-white absolute top-[108%]">
            <ul>
              <li
                className={`p-2 hover:text-orange ${
                  order === "asc" && " text-orange"
                }`}
                onClick={() => handleSortPrice("asc")}
              >
                Giá: Thấp đến Cao
              </li>
              <li
                className={`p-2 hover:text-orange ${
                  order === "desc" && " text-orange"
                }`}
                onClick={() => handleSortPrice("desc")}
              >
                Giá: Cao đến Thấp
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="lg:block hidden">
        <Pagination
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          page={page || 1}
          total_pages={total_pages || 1}
        />
      </div>
    </div>
  );
}
