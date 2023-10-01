import { useRouter } from "next/router";
import React, { ReactNode, createContext, useContext } from "react";

export interface PaginationProps {
  page: number;
  total_pages: number;
  children: ReactNode;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleSelectPage: (page: number) => void;
}

const PaginationContext = createContext<Omit<PaginationProps, "children">>({
  page: 1,
  total_pages: 1,
  handleNextPage: () => {},
  handlePrevPage: () => {},
  handleSelectPage: () => {},
});

export function Pagination({
  page,
  total_pages,
  children,
}: Pick<PaginationProps, "page" | "total_pages" | "children">) {
  const { pathname, query, push } = useRouter();
  const handlePrevPage = () => {
    if (page === 1) return;
    push({
      pathname,
      query: {
        ...query,
        page: +page - 1,
      },
    });
  };
  const handleNextPage = () => {
    if (total_pages === page) return;
    push({
      pathname,
      query: {
        ...query,
        page: +page + 1,
      },
    });
  };
  const handleSelectPage = (page: number) => {
    push({
      pathname,
      query: {
        ...query,
        page,
      },
    });
  };

  return (
    <PaginationContext.Provider
      value={{
        page,
        total_pages,
        handleNextPage,
        handlePrevPage,
        handleSelectPage,
      }}
    >
      <div className="flex items-center">{children}</div>
    </PaginationContext.Provider>
  );
}
function Mini() {
  const { total_pages, handlePrevPage, page, handleNextPage } =
    useContext(PaginationContext);
  if (total_pages === 1) return null;
  return (
    <>
      <div className="mr-4">
        <span className="text-blue-200 font-medium">{page}</span>
        <span>/{total_pages}</span>
      </div>
      <button
        onClick={handlePrevPage}
        disabled={page <= 1}
        className={`h-8 w-8 border-box bg-box shadow-sm-50 flex border  items-center justify-center`}
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
        disabled={+page === +total_pages}
        className={`h-8 w-8  flex border border-box bg-box shadow-sm-50 items-center justify-center`}
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
    </>
  );
}
const RANGE = 2;
function Maxi() {
  const {
    total_pages,
    handlePrevPage,
    page,
    handleNextPage,
    handleSelectPage,
  } = useContext(PaginationContext);
  const renderPagination = () => {
    let dotAfter = false;
    let dotBefore = false;
    const renderDotBefore = (i: number) => {
      if (dotBefore) return null;
      dotBefore = true;
      return (
        <button
          key={i}
          disabled={true}
          className={`h-8 w-8 bg-inherit items-center  justify-center hover:text-brand-600`}
        >
          ...
        </button>
      );
    };
    const renderDotAfter = (i: number) => {
      if (dotAfter) return null;
      dotAfter = true;
      return (
        <button
          disabled={true}
          key={i}
          className={`h-8 w-8 bg-inherit items-center justify-center hover:text-brand-600`}
        >
          ...
        </button>
      );
    };

    return Array(total_pages)
      .fill(0)
      .map((_, i) => {
        const pageNumber = i + 1;
        if (
          pageNumber > page + RANGE &&
          page <= RANGE * 2 + 1 &&
          pageNumber < total_pages - RANGE + 1
        ) {
          return renderDotAfter(i);
        } else if (page > RANGE * 2 + 1 && page < total_pages - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            renderDotBefore(i);
          } else if (
            pageNumber > page + RANGE + 1 &&
            pageNumber < total_pages - RANGE + 1
          ) {
            return renderDotAfter(i);
          }
        } else if (
          page >= total_pages - RANGE * 2 &&
          pageNumber > RANGE &&
          pageNumber < page - RANGE
        ) {
          return renderDotBefore(i);
        }
        return (
          <button
            key={i}
            onClick={() => handleSelectPage(i + 1)}
            className={`h-8 w-8 flex rounded-md  items-center justify-center ${
              +page === i + 1 ? "bg-blue-200 text-grey-0" : ""
            }`}
          >
            {i + 1}
          </button>
        );
      });
  };
  if (total_pages === 1) return null;

  return (
    <>
      <button
        onClick={handlePrevPage}
        disabled={page <= 1}
        className={`h-8 w-8 bg-box  flex  items-center justify-center`}
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
      {renderPagination()}
      <button
        onClick={handleNextPage}
        disabled={+page === +total_pages}
        className={`h-8 w-8 bg-box  flex  items-center justify-center`}
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
    </>
  );
}
Pagination.Mini = Mini;
Pagination.Maxi = Maxi;
