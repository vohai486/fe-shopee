import { SortBy } from "@/components/common";
import Filter from "@/components/common/filter";

export function VoucherTableOperations() {
  return (
    <div className="flex items-center gap-4">
      <Filter
        filterField="status"
        options={[
          {
            status: "",
            label: "Tất cả",
          },
          { status: "happenning", label: "Đang diễn ra" },
          { status: "upcoming", label: "Sắp diễn ra" },
          { status: "finished", label: "Đã kết thúc" },
        ]}
        getOptionsLabel={(option) => option.label}
        getOptionsValue={(option) => option.status}
      />
      <SortBy
        options={[
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
