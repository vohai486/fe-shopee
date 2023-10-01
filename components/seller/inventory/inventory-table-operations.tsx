import Filter from "@/components/common/filter";

export function InventoryTableOperations() {
  return (
    <div>
      <Filter
        filterField="status"
        options={[
          {
            status: "",
            label: "Còn hàng",
          },
          {
            status: "out-of-stock",
            label: "Hết hàng",
          },
          {
            status: "low-in-stock",
            label: "Sắp hết hàng",
          },
        ]}
        getOptionsLabel={(option) => option.label}
        getOptionsValue={(option) => option.status}
      />
    </div>
  );
}
