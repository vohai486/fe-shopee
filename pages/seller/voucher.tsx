import { SellerLayout } from "@/components/layouts";
import { VoucherTable, VoucherTableOperations } from "@/components/seller";

export default function VoucherSellerPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Voucher</h1>
        <VoucherTableOperations />
      </div>
      <VoucherTable />
    </>
  );
}
VoucherSellerPage.Layout = SellerLayout;
