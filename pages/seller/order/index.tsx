import { SellerLayout } from "@/components/layouts";
import { OrderTable, OrderTableOperations } from "@/components/seller/order";

export default function OrderSellerPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-title font-bold">Đơn hàng</h1>
        <OrderTableOperations />
      </div>
      <OrderTable />
    </>
  );
}
OrderSellerPage.Layout = SellerLayout;
