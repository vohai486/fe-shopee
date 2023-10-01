import React from "react";
import { useRouter } from "next/router";
import { Select } from "./select";

export function SortBy<T>({
  options,
  getOptionsLabel,
  getOptionsValue,
}: {
  options: T[];
  getOptionsLabel: (option: T) => string;
  getOptionsValue: (option: T) => string;
}) {
  const { query, pathname, push } = useRouter();
  function handleChange(status: string) {
    push({
      pathname,
      query: {
        ...query,
        sortBy: status,
      },
    });
  }
  return (
    <Select
      getOptionsValue={getOptionsValue}
      getOptionsLabel={getOptionsLabel}
      options={options}
      value={(query.sortBy as string) || ""}
      onChange={handleChange}
    ></Select>
  );
}
