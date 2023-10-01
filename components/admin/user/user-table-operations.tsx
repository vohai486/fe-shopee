import { SortBy } from "@/components/common";
import Filter from "@/components/common/filter";

export function UserTableOperations() {
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
            type: "active",
            label: "Hoạt động",
          },
          {
            type: "inactive",
            label: "Không hoạt động",
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
