import { checkoutApi } from "@/api-client";
import { ConfirmModal, Modal } from "@/components/common";
import { ButtonChatShop } from "@/components/common/button-chat-shop";
import { UserProfileLayout } from "@/components/layouts";
import { ModelReview } from "@/components/user";
import { STATUS_ORDER } from "@/constants";
import { formatPriceVND, generateTitleByOrderStatus } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

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
  const { data, refetch } = useQuery({
    queryKey: ["/purchase", router.query],
    queryFn: () => checkoutApi.getOrdersByUser(router.query),
    keepPreviousData: true,
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
    <Modal>
      <div className="w-full">
        <div className="text-blue-50 flex cursor-pointer hidden-scroll  bg-box border border-box rounded-md whitespace-nowrap shadow-sm mb-3 overflow-x-scroll">
          {options.map((item) => (
            <Link
              key={item.label}
              href={{
                pathname: "/user/purchase",
                query: {
                  status: item.query,
                },
              }}
              className={`py-4 min-w-[160px] border-b-2  text-center  ${
                item.query === router.query.status ||
                (!router?.query.status && item.query === "")
                  ? " text-blue-200 border-blue-200"
                  : "border-transparent"
              }`}
              onClick={() => handleQueryPurchase(item.query)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="text-sm  mt-3 overflow-auto hidden-scroll">
        {data?.metadata.map((order) => (
          <div
            key={order._id}
            className="mb-3 bg-box rounded-md border border-box"
          >
            <div className="md:px-8 p-4 border-b border-box shadow-sm-50">
              <div className="flex pb-3 justify-between md:flex-row flex-col gap-y-2">
                <div className="flex items-center gap-x-2">
                  <div className="font-medium text-title">
                    {order.order_shop.shop_name}
                  </div>
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
                </div>
                <div className="flex flex-wrap text-blue-100">
                  <div>
                    {generateTitleByOrderStatus(order.order_status).title}
                  </div>{" "}
                  <span className="mx-2">|</span>
                  <div className="uppercase text-brand-600">
                    {generateTitleByOrderStatus(order.order_status).label}
                  </div>
                </div>
              </div>
              {order.order_products.map((item) => (
                <Link
                  href={`/user/purchase/${order._id}`}
                  className="py-3 border-t border-box flex gap-x-3"
                  key={item.product._id}
                >
                  <Image
                    src={item.product.product_thumb}
                    width={80}
                    height={80}
                    alt=""
                    className="shrink-0"
                  />
                  <div className="flex flex-col grow justify-between">
                    <p className="line-clamp-2">{item.product.product_name}</p>
                    <div>x{item.quantity}</div>
                    <div>{formatPriceVND(item.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="bg-box bg-opacity-50 md:px-8 p-4">
              <div className="text-right mb-3">
                Thành tiền:{" "}
                <span className="text-blue-200 text-lg sm:text-2xl">
                  {formatPriceVND(order.order_checkout.totalCheckout)}
                </span>
              </div>
              <div className="flex justify-end gap-x-2">
                {order.order_status === STATUS_ORDER.DELIVERED && (
                  <Modal.Open opens={order._id}>
                    <button className="text-grey-0 rounded-md h-10 w-[150px] bg-blue-200 hover:bg-opacity-75">
                      Đánh Giá
                    </button>
                  </Modal.Open>
                )}
                <Modal.Window name={order._id}>
                  <ModelReview order={order} />
                </Modal.Window>
                {order.order_status === STATUS_ORDER.PENDING && (
                  <Modal.Open opens={`del-${order._id}`}>
                    <button
                      // onClick={() => handleCancelOrder(order._id)}
                      className="text-brand-50 rounded-md h-10 w-[150px] bg-red-200 text-grey-0 font-semibold hover:bg-opacity-75"
                    >
                      Hủy đơn
                    </button>
                  </Modal.Open>
                )}
                <Modal.Window name={`del-${order._id}`}>
                  <ConfirmModal
                    onConfirm={() => handleCancelOrder(order._id)}
                    label="Xác nhận hủy đơn hàng"
                    isLoading={cancelMutation.isLoading}
                  />
                </Modal.Window>
                <button className=" rounded-md h-10 w-[150px] border-blue-200 border hover:bg-blue-200 hover:text-grey-0 font-semibold text-black-100 dark:text-grey-0 hover:bg-opacity-75">
                  Liên hệ Người Bán
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
PurchasePage.Layout = UserProfileLayout;
