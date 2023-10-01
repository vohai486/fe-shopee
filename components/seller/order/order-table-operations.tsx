import { SortBy } from "@/components/common";
import Filter from "@/components/common/filter";
import { STATUS_ORDER } from "@/constants";

export function OrderTableOperations() {
  return (
    <div className="flex items-center gap-4">
      <Filter
        filterField="status"
        options={[
          {
            status: "",
            label: "Tất cả",
          },
          { status: STATUS_ORDER.PENDING, label: "Chờ xác nhận" },
          { status: STATUS_ORDER.CONFIRMED, label: "Chờ lấy hàng" },
          { status: STATUS_ORDER.SHIPPED, label: "Đang giao" },
          { status: STATUS_ORDER.DELIVERED, label: "Hoàn thành" },
          { status: STATUS_ORDER.CANCELLED, label: "Đơn hủy" },
        ]}
        getOptionsLabel={(option) => option.label}
        getOptionsValue={(option) => option.status}
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
        ]}
        getOptionsLabel={(option) => option.label}
        getOptionsValue={(option) => option.value}
      />
    </div>
  );
}
