import { checkoutApi } from "@/api-client";
import { Loading } from "@/components/common";
import { ButtonChatShop } from "@/components/common/button-chat-shop";
import { UserProfileLayout } from "@/components/layouts";
import { formatPriceVND, getStatusOrder } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PurchaseDetailPage() {
  const { query, isReady } = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["order-user", query.id],
    queryFn: () => checkoutApi.getOrderDetailByUser((query.id as string) || ""),
    enabled: isReady,
  });
  const order = data?.metadata;
  if (isLoading) return <Loading />;
  if (!order && !isLoading) return null;
  return (
    <div>
      <div className="text-right mb-4">
        <Link
          href="/user/purchase"
          className="flex justify-end text-blue-200 font-medium"
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
        <div className="bg-box text-sm border md:p-8 p-4 shadow-sm-50 border-box rounded-md">
          <div className="border-b border-box pb-4 uppercase flex sm:flex-row flex-col gap-y-2  justify-between">
            <span>mã đơn hàng: {order._id}</span>
            <span className="text-blue-200">
              {getStatusOrder(order.order_status)}
            </span>
          </div>
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-medium text-title">
                Địa Chỉ Nhận Hàng
              </div>
              {order.order_isPaid && (
                <div className=" text-red-100"> Đã thanh toán</div>
              )}
            </div>
            <div className="mb-1 font-semibold">
              {order.order_shipping.fullName}
            </div>
            <div className="text-blue-100 ">
              {order.order_shipping.phoneNumber} {" - "}
              {order.order_shipping.street}, {order.order_shipping.ward},{" "}
              {order.order_shipping.district}, {order.order_shipping.city}
            </div>
          </div>
          <div className="dark:bg-grey-50-dark/60 mt-2">
            <div className="py-3 border-b border-box">
              <div className="flex pb-3 items-center text-xs gap-x-2 border-b border-box">
                <span className="font-medium text-title text-base">
                  {order.order_shop.shop_name}
                </span>
                <ButtonChatShop
                  conversation={{
                    _id: "",
                    user: {
                      _id: order.order_shop._id,
                      fullName: order.order_shop.shop_name,
                      avatar: order.order_shop.shop_avatar,
                    },
                  }}
                  label="Chat"
                />
                <Link
                  href={`/shop/${order.order_shop._id}`}
                  className=" gap-x-1 hover:bg-opacity-75 flex items-center border border-blue-50 text-black-100 dark:text-grey-0 py-1 px-2 rounded-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                    />
                  </svg>
                  Xem Shop
                </Link>
              </div>
              <div>
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
                      className="shrink-0"
                    />
                    <div className="flex w400:flex-row w-full flex-col justify-between gap-x-5">
                      <div>
                        <p className="font-medium text-title line-clamp-2">
                          {product.product.product_name}
                        </p>
                        <span className="text-blue-100 font-semibold">
                          x {product.quantity}
                        </span>
                      </div>
                      <div className="text-blue-200 font-semibold shrink-0 my-auto">
                        {formatPriceVND(product.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-b border-box">
              <div className="flex justify-between sm:justify-end  items-center">
                <div className="pr-4 sm:w-auto w-1/2 text-blue-50">
                  Tổng tiền hàng
                </div>
                <div className="sm:w-[200px] font-medium w-1/2 sm:border-l border-box py-3  text-right">
                  {formatPriceVND(order.order_checkout.totalPrice)}
                </div>
              </div>
            </div>
            <div className="border-b border-box">
              <div className="flex justify-end sm:justify-end items-center">
                <div className="pr-4 sm:w-auto w-1/2 text-blue-50">
                  Phí vận chuyển
                </div>
                <div className="sm:w-[200px] font-medium w-1/2 sm:border-l border-box py-3  text-right">
                  {formatPriceVND(order.order_checkout.feeShip)}
                </div>
              </div>
            </div>
            <div className="border-b border-box">
              <div className="flex justify-end sm:justify-end items-center">
                <div className="pr-4 sm:w-auto w-1/2 text-blue-50">
                  Giảm giá
                </div>
                <div className="sm:w-[200px] font-medium w-1/2 sm:border-l border-box py-3  text-right">
                  {formatPriceVND(order.order_checkout.totalDiscount)}
                </div>
              </div>
            </div>
            <div className="border-b border-box">
              <div className="flex justify-end sm:justify-end items-center">
                <div className="pr-4 sm:w-auto w-1/2 text-blue-50">
                  Thành tiền
                </div>
                <div className="sm:w-[200px] font-medium w-1/2 sm:border-l border-box py-3  text-right">
                  {formatPriceVND(order.order_checkout.totalCheckout)}
                </div>
              </div>
            </div>
            <div className="border-b border-box">
              <div className="flex justify-end sm:justify-end items-center">
                <div className="pr-4 sm:w-auto w-1/2 text-blue-50">
                  Phương thức thanh toán
                </div>
                <div className="sm:w-[200px] font-medium w-1/2 sm:border-l border-box py-3  text-right">
                  {order.order_payment.type === "cod"
                    ? "Thanh toán khi nhận hàng"
                    : "Thanh toán Vnpay"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
PurchaseDetailPage.Layout = UserProfileLayout;
