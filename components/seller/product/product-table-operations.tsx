import { SortBy } from "@/components/common";
import Filter from "@/components/common/filter";
import * as React from "react";

export function ProductTableOperations() {
  return (
    <div className="flex items-center gap-4">
      <Filter
        filterField="type"
        options={[
          {
            type: "",
            label: "Tất cả",
          },
          {
            type: "published",
            label: "Đang hoạt động",
          },
          {
            type: "out-stock",
            label: "Hết hàng",
          },
          {
            type: "wait-vefify",
            label: "Chờ duyệt",
          },
          {
            type: "draft",
            label: "Đã ẩn",
          },
        ]}
        getOptionsLabel={(option) => option.label}
        getOptionsValue={(option) => option.type}
      />
      <SortBy
        options={[
          {
            value: "price-asc",
            label: "Giá: tăng dần",
          },
          { value: "price-desc", label: "Giá: giảm dần" },
          { value: "oldest", label: "Ngày: cũ nhất" },
          { value: "", label: "Ngày: mới nhất" },
          { value: "name-asc", label: "Tên: A-Z" },
          { value: "name-desc", label: "Tên: Z-A" },
        ]}
        getOptionsLabel={(option) => option.label}
        getOptionsValue={(option) => option.value}
      />
    </div>
  );
}
