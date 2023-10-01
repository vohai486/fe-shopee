import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function Filter<T>({
  filterField,
  options,
  getOptionsLabel,
  getOptionsValue,
}: {
  filterField: string;
  options: T[];
  getOptionsLabel: (option: T) => string;
  getOptionsValue: (option: T) => string;
}) {
  const { query, pathname, push } = useRouter();

  const classNameItem = `rounded-md text-blue-50 font-medium py-1 px-2 hover:enabled:bg-blue-200 hover:enabled:text-grey-0 ease-in-out`;
  return (
    <div className="text-sm rounded-md bg-box border border-box shadow-sm-50 p-1 flex gap-1">
      <ul className="flex items-center gap-1">
        {options.map((option) => {
          const value = getOptionsValue(option);
          const label = getOptionsLabel(option);
          const filter = query[filterField];
          const isActive =
            value !== "" ? filter === value : !!filter === !!value;
          return (
            <li key={value}>
              <button
                className={`${classNameItem} ${
                  isActive ? "bg-blue-200 text-grey-0" : "bg-inherit"
                }`}
                // disabled={isActive}
                onClick={() => {
                  const queryParams = { ...query };
                  queryParams[filterField] = value;
                  push({
                    pathname,
                    query: {
                      ...queryParams,
                      page: 1,
                    },
                  });
                }}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
