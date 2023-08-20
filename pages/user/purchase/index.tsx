import { checkoutApi } from "@/api-client";
import { ButtonChatShop } from "@/components/common/button-chat-shop";
import { UserProfileLayout } from "@/components/layouts";
import { ModelReview } from "@/components/user";
import { STATUS_ORDER } from "@/constants";
import { Order } from "@/types";
import { formatPriceVND, generateTitleByOrderStatus } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const options = [
  {
    query: "",
    label: "Tất cả",
  },
  {
    query: "pending",
    label: "Chờ xác nhận",
  },
  {
    query: "confirmed",
    label: "Chờ vận chuyển",
  },
  {
    query: "shipped",
    label: "Đang Giao",
  },
  {
    query: "delivered",
    label: "Hoàn thành",
  },
  {
    query: "cancelled",
    label: "Đã hủy",
  },
];
export default function PurchasePage() {
  const router = useRouter();
  const [selectOrder, setSelectOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ["/purchase", router.query],
    queryFn: () => checkoutApi.getOrdersByUser(router.query),
    keepPreviousData: true,
    staleTime: 60 * 60 * 1000,
    enabled: router.isReady,
  });
  const cancelMutation = useMutation({
    mutationFn: checkoutApi.cancelOrderByUser,
    onSuccess: () => {
      refetch();
    },
  });
  const handleCancelOrder = (id: string) => {
    cancelMutation.mutate(id);
  };
  const handleQueryPurchase = (status?: string) => {
    router.push({
      pathname: "/user/purchase",
      query: {
        status,
      },
    });
  };
  return (
    <>
      {showModal && selectOrder?._id && (
        <ModelReview
          selectOrder={selectOrder}
          onClose={() => {
            setShowModal(false);
            setSelectOrder(null);
          }}
        />
      )}
      <div className="w-full">
        <div className=" flex cursor-pointer custom-scrollbar  bg-white whitespace-nowrap shadow-sm mb-3 overflow-x-scroll">
          {options.map((item) => (
            <Link
              key={item.label}
              href={{
                pathname: "/user/purchase",
                query: {
                  status: item.query,
                },
              }}
              className={`py-4 min-w-[160px]  text-center  ${
                (item.query === router.query.status ||
                  (!router?.query.status && item.query === "")) &&
                " text-orange border-b-2 border-orange"
              }`}
              onClick={() => handleQueryPurchase(item.query)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="text-sm max-h-[725px] mt-3 overflow-auto hidden-scroll">
        {data?.metadata.map((order) => (
          <div key={order._id} className="mb-3">
            <div className="sm:p-6 p-3 pb-3 bg-white">
              <div className="flex pb-3 justify-between  md:flex-row flex-col gap-y-2">
                <div className="flex items-center gap-x-2">
                  <div className="font-bold">{order.order_shop.shop_name}</div>
                  <div className="flex text-xs gap-x-2">
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
                      className="text-black gap-x-1 font-medium hover:bg-gray1 flex items-center border border-gray3 bg-white py-1 px-2 rounded-sm"
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
                </div>
                <div className="flex flex-wrap">
                  <div>
                    {generateTitleByOrderStatus(order.order_status).title}
                  </div>{" "}
                  <span className="mx-2">|</span>
                  <div className="uppercase text-orange">
                    {generateTitleByOrderStatus(order.order_status).label}
                  </div>
                </div>
              </div>
              {order.order_products.map((item) => (
                <Link
                  href={`/user/purchase/${order._id}`}
                  className="py-3 border-t border-gray1 flex gap-x-3"
                  key={item.product._id}
                >
                  <Image
                    src={item.product.product_thumb}
                    width={80}
                    height={80}
                    alt=""
                  />
                  <div className="flex flex-col sm:flex-row grow justify-between">
                    <div className="grow flex gap-x-2 flex-row sm:flex-col justify-between">
                      <p className="line-clamp-2">
                        {item.product.product_name}
                      </p>
                      <div className="shrink-0">x{item.quantity}</div>
                    </div>
                    <div className="my-auto">{formatPriceVND(item.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="bg-orange/5 p-3 sm:p-6">
              <div className="text-right mb-6">
                Thành tiền:{" "}
                <span className="text-orange text-lg sm:text-2xl">
                  {formatPriceVND(order.order_checkout.totalCheckout)}
                </span>
              </div>
              <div className="flex justify-end gap-x-2">
                {order.order_status === STATUS_ORDER.DELIVERED && (
                  <button
                    onClick={() => {
                      setSelectOrder(order);
                      setShowModal(true);
                    }}
                    className="text-white rounded-md h-10 w-[150px] bg-orange hover:bg-orange/80"
                  >
                    Đánh Giá
                  </button>
                )}
                {order.order_status === STATUS_ORDER.PENDING && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="text-white rounded-md h-10 w-[150px] bg-red hover:bg-red/80"
                  >
                    Hủy đơn
                  </button>
                )}

                <button className=" rounded-md h-10 w-[150px] bg-gray3  border-gray hover:bg-gray">
                  Liên hệ Người Bán
                </button>
                {/* <button className=" rounded-md h-10 w-[150px] bg-white border-gray1 hover:bg-gray">
                  Mua Lại
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
PurchasePage.Layout = UserProfileLayout;
