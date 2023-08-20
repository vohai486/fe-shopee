import { checkoutApi } from "@/api-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ProtectedLayout } from "@/components/layouts";
import { Loading } from "@/components/common";
import { toast } from "react-toastify";

export default function CheckoutPaymentPage() {
  const queryClient = useQueryClient();
  const { query, isReady, push } = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["checkout-payment"],
    queryFn: () => checkoutApi.vnpayReturn(query),
    enabled: isReady,
    onSuccess() {
      toast.success("Thanh toán thành công");
      queryClient.invalidateQueries(["carts"]);
      push("/user/purchase");
    },
  });
  if (isLoading) return <Loading />;
  return (
    <div className="mt-6 container">
      {data?.metadata &&
        !isLoading &&
        (data.metadata === 1 ? (
          <div className="bg-orange w-full text-white text-center text-lg py-3">
            Thanh toán thành công
          </div>
        ) : (
          <div className="bg-red w-full text-white text-center text-lg py-3">
            Thanh toán thất bại
          </div>
        ))}
    </div>
  );
}
CheckoutPaymentPage.Layout = ProtectedLayout;
