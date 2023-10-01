import { checkoutApi } from "@/api-client";
import { Loading } from "@/components/common";
import { ButtonChatShop } from "@/components/common/button-chat-shop";
import { SellerLayout } from "@/components/layouts";
import { formatPriceVND, getStatusOrder } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function OrderDetailPage() {
  const { query, isReady } = useRouter();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["order-shop", query.id],
    queryFn: () => checkoutApi.getOrderDetailByUser((query.id as string) || ""),
    enabled: !!query?.id,
  });
  const order = data?.metadata;

  if (isLoading || isFetching) {
    return <Loading />;
  }
  if (!order && !isLoading) return null;
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-title font-bold">Chi tiết đơn hàng</h1>
        <Link
          href="/seller/order"
          className="flex justify-end text-blue-200 font-bold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
            />
          </svg>
          <span>Quay lại</span>
        </Link>
      </div>
      {order && (
        <div className=" border md:p-8 p-4 bg-box border-box rounded-md text-sm">
          <div className="border-b border-box pb-4 uppercase flex sm:flex-row flex-col gap-y-2  justify-between">
            <span>mã đơn hàng: {order._id}</span>
            <span className="text-blue-200">
              {getStatusOrder(order.order_status)}
            </span>
          </div>
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl text-title font-semibold">
                Địa Chỉ Nhận Hàng
              </div>
              {order.order_isPaid && (
                <div className=" text-red-200">Đã thanh toán</div>
              )}
            </div>
            <div className="mb-1 text-blue-50 font-medium">
              {order.order_shipping.fullName}
            </div>
            <div className="text-blue-100">
              {order.order_shipping.phoneNumber} {" - "}
              {order.order_shipping.street}, {order.order_shipping.ward},{" "}
              {order.order_shipping.district}, {order.order_shipping.city}
            </div>
          </div>
          <div className="dark:bg-grey-50-dark/60 bg-grey-50-dark/60">
            <div className="py-3 border-b border-box">
              {order.order_products.map((product) => (
                <div
                  className="flex gap-x-3 items-start  pt-3"
                  key={product.product._id}
                >
                  <Image
                    src={product.product.product_thumb}
                    alt=""
                    width={80}
                    height={80}
                  />
                  <div className="flex w-full gap-x-5 justify-between">
                    <div>
                      <p className=" text-title line-clamp-2">
                        {product.product.product_name}
                      </p>
                      <span>x {product.quantity}</span>
                    </div>
                    <div className="text-blue-200 shrink-0 my-auto">
                      {formatPriceVND(product.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className=" px-3 md:px-6 border-b border-box">
              <div className="flex justify-between sm:justify-end  items-center">
                <div className="pr-4 sm:w-auto w-1/2 text-blue-100">
                  Tổng tiền hàng
                </div>
                <div className="sm:w-[200px] font-medium text-base text-black-100 dark:text-grey-300 w-1/2 sm:border-l border-box py-3  text-right">
                  {formatPriceVND(order.order_checkout.totalPrice)}
                </div>
              </div>
            </div>
            <div className=" px-3 md:px-6 border-b border-box">
              <div className="flex justify-end sm:justify-end items-center">
                <div className="pr-4 sm:w-auto w-1/2 text-blue-100">
                  Phí vận chuyển
                </div>
                <div className="sm:w-[200px] w-1/2 font-medium dark:text-grey-300 text-base text-black-100 sm:border-l border-box py-3  text-right">
                  {formatPriceVND(order.order_checkout.feeShip)}
                </div>
              </div>
            </div>
            <div className=" px-3 md:px-6 border-b border-box">
              <div className="flex justify-end sm:justify-end items-center">
                <div className="pr-4 sm:w-auto w-1/2 text-blue-100">
                  Giảm giá
                </div>
                <div className="sm:w-[200px] w-1/2 font-medium text-base dark:text-grey-300 text-black-100 sm:border-l border-box py-3  text-right">
                  {formatPriceVND(order.order_checkout.totalDiscount)}
                </div>
              </div>
            </div>
            <div className=" px-3 md:px-6 border-b border-box">
              <div className="flex justify-end sm:justify-end items-center">
                <div className="pr-4 sm:w-auto w-1/2 text-blue-100">
                  Thành tiền
                </div>
                <div className="w-[200px] sm:border-l  border-box py-3 text-2xl text-blue-200 font-medium  text-right">
                  {formatPriceVND(order.order_checkout.totalCheckout)}
                </div>
              </div>
            </div>
            <div className=" px-3 md:px-6 border-b border-box">
              <div className="flex justify-end sm:justify-end items-center">
                <div className="pr-4 sm:w-auto w-1/2 text-blue-100">
                  Phương thức thanh toán
                </div>
                <div className="w-[200px] sm:border-l font-medium dark:text-grey-300 text-base text-black-100 border-box py-3  text-right">
                  {order.order_payment.type === "cod"
                    ? "Thanh toán khi nhận hàng"
                    : "Thanh toán Vnpay"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
OrderDetailPage.Layout = SellerLayout;
