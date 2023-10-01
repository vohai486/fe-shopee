import { ProductTable, ProductTableOperations } from "@/components/admin";
import { AdminLayout } from "@/components/layouts";

export default function ProductAdminPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-title font-semibold">Sản phẩm</h1>
        <ProductTableOperations />
      </div>
      <ProductTable />
    </>
  );
}
ProductAdminPage.Layout = AdminLayout;
