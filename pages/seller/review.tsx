import { SellerLayout } from "@/components/layouts";
import { VoucherTable, VoucherTableOperations } from "@/components/seller";
import { ReviewList } from "@/components/seller/review";

export default function ReviewSellerPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Review</h1>
      </div>
      <ReviewList />
    </>
  );
}
ReviewSellerPage.Layout = SellerLayout;
