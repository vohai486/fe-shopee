import { ShopTable, ShopTableOperations } from "@/components/admin";
import { AdminLayout } from "@/components/layouts";

export default function ShopPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-title font-semibold">Sản phẩm</h1>
        <ShopTableOperations />
      </div>
      <ShopTable />
    </>
  );
}
ShopPage.Layout = AdminLayout;
