import { SortBy } from "@/components/common";
import Filter from "@/components/common/filter";
import * as React from "react";

export interface IAppProps {}

export function ProductTableOperations(props: IAppProps) {
  return (
    <div className="flex items-center gap-4">
      <Filter
        filterField="status"
        options={[
          {
            type: "",
            label: "Tất cả",
          },
          {
            type: "wait-verify",
            label: "Chờ duyệt",
          },
          {
            type: "verify",
            label: "Đã duyệt",
          },
        ]}
        getOptionsLabel={(option) => option.label}
        getOptionsValue={(option) => option.type}
      />
      <SortBy
        options={[
          { value: "oldest", label: "Ngày: cũ nhất" },
          { value: "", label: "Ngày: mới nhất" },
        ]}
        getOptionsLabel={(option) => option.label}
        getOptionsValue={(option) => option.value}
      />
    </div>
  );
}
