import { checkoutApi } from "@/api-client";
import { SellerLayout } from "@/components/layouts";
import { STATUS_ORDER as STATUS } from "@/constants";
import { formatDate, formatPriceVND, getStatusOrder } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

const options = [
  {
    status: "",
    label: "Tất cả",
  },
  { status: STATUS.PENDING, label: "Chờ xác nhận" },
  { status: STATUS.CONFIRMED, label: "Chờ lấy hàng" },
  { status: STATUS.SHIPPED, label: "Đang giao" },
  { status: STATUS.DELIVERED, label: "Hoàn thành" },
  { status: STATUS.CANCELLED, label: "Đơn hủy" },
];

export default function OrderSellerPage() {
  const { query, pathname } = useRouter();
  const { data, refetch } = useQuery({
    queryKey: ["order-shop", query],
    queryFn: () => checkoutApi.getOrdersByShop(query),
    staleTime: 60,
  });
  const confirmMutation = useMutation({
    mutationFn: checkoutApi.confirmOrderByShop,
    onSuccess: () => refetch(),
  });
  const shipMutation = useMutation({
    mutationFn: checkoutApi.shipOrderByShop,
    onSuccess: () => refetch(),
  });
  interface a {
    userId: string;
  }
  const cancelMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { userId: string };
    }) => checkoutApi.cancelOrderByShop(id, payload),
    onSuccess: () => refetch(),
  });
  const deliveredMutation = useMutation({
    mutationFn: checkoutApi.deliveredOrderByShop,
    onSuccess: () => refetch(),
  });

  const handleConfirm = (id: string) => confirmMutation.mutate(id);
  const handleShipped = (id: string) => shipMutation.mutate(id);
  const handleCancel = (id: string, payload: { userId: string }) =>
    cancelMutation.mutate({ id, payload });
  const handleDelivered = (id: string) => deliveredMutation.mutate(id);

  return (
    <div className=" text-sm">
      <div className="bg-white px-3 lg:px-6 pb-6">
        <div
          className=" flex overflow-x-scroll  border-b border-gray3
         cursor-pointer hidden-scroll  flex-nowrap shadow-sm 
        "
        >
          {options.map((item) => (
            <Link
              key={item.status}
              href={{ pathname: pathname, query: { status: item.status } }}
              className={`min-w-[150px] px-2 py-4 text-center  my-auto  ${
                (query.status === item.status ||
                  (item.status === "" && !query.status)) &&
                "text-orange border-b-4  font-bold border-orange"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mt-6">
          {/* <div className="text-right mb-4">
            <button className="border border-gray1">Xuất</button>
          </div> */}
          <div className="my-6 flex justify-between items-center">
            <div className="text-2xl font-bold">Đơn hàng</div>
            <button className="bg-orange text-white h-10 px-3 rounded-sm">
              Giao Hàng Loạt
            </button>
          </div>
          <div className="lg:block hidden">
            <div className="grid grid-cols-6 border text-center border-gray1 bg-gray px-4 py-3">
              <div className="col-span-3 text-left">Sản phẩm</div>
              <div className="col-span-1">Doanh thu đơn hàng</div>
              <div className="col-span-1">Thời gian tạo</div>
              <div className="col-span-1">
                {query.status === STATUS.DELIVERED
                  ? "Ngày giao hàng"
                  : "Thanh toán"}
              </div>
            </div>
          </div>
        </div>
        <div className="max-h-[600px] overflow-auto hidden-scroll">
          {data?.metadata &&
            data.metadata.orders.map((order) => (
              <div className="mt-4" key={order._id}>
                <div className="p-4 border-gray1 border bg-gray gap-y-2 flex sm:flex-row flex-col justify-between sm:items-center">
                  <div className="flex gap-x-2 items-center shrink-0  ">
                    <div className="bg-white rounded-full shrink-0 w-8 h-8 border border-gray1 overflow-hidden">
                      {order.order_user.avatar && (
                        <Image
                          width={32}
                          height={32}
                          src={order.order_user.avatar}
                          alt=""
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>
                    <span>{order.order_user.fullName}</span>
                  </div>
                  <div>ID đơn hàng: {order._id}</div>
                </div>
                <div className="p-2 flex justify-between w400:flex-row flex-col gap-y-2 border-b-2 border-orange">
                  <span>{getStatusOrder(order.order_status)}</span>
                  <div className="text-blue flex gap-x-2 cursor-pointer">
                    {order.order_status === STATUS.PENDING && (
                      <div onClick={() => handleConfirm(order._id)}>
                        Xác nhận
                      </div>
                    )}
                    {(order.order_status === STATUS.PENDING ||
                      order.order_status === STATUS.CONFIRMED) && (
                      <div
                        onClick={() =>
                          handleCancel(order._id, {
                            userId: order.order_user._id,
                          })
                        }
                      >
                        Hủy Đơn
                      </div>
                    )}

                    {order.order_status === STATUS.CONFIRMED && (
                      <div onClick={() => handleShipped(order._id)}>
                        Đã lấy hàng
                      </div>
                    )}
                    {order.order_status === STATUS.SHIPPED && (
                      <div onClick={() => handleDelivered(order._id)}>
                        Đã giao
                      </div>
                    )}
                    {order.order_status === STATUS.DELIVERED &&
                      "Gửi yêu cầu đánh giá"}
                  </div>
                </div>
                {order.order_products.map(
                  ({ price, product, quantity }, idx) => (
                    <>
                      <div
                        className=" grid-cols-6 text-center lg:grid hidden"
                        key={product._id}
                      >
                        <div className="col-span-3 text-left p-4 border border-gray1 flex">
                          <div className="grow flex gap-x-2">
                            <Image
                              width={80}
                              height={80}
                              src={product.product_thumb}
                              alt=""
                            />
                            <div>
                              <p className="line-clamp-2">
                                {product.product_name}
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0"> x {quantity}</div>
                        </div>
                        <div className="col-span-1 p-2 lg:p-4 border border-gray1">
                          {formatPriceVND(price)}
                        </div>
                        <div className="col-span-1 p-2 lg:p-4 border border-gray1">
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="col-span-1 p-2 lg:p-4 border border-gray1">
                          {query.status === STATUS.DELIVERED &&
                          order.order_deliveredAt
                            ? formatDate(order.order_deliveredAt)
                            : order.order_isPaid
                            ? "Đã thanh toán"
                            : "-"}
                        </div>
                      </div>
                      {idx !== 0 && (
                        <div className="h-[1px] block lg:hidden w-full bg-gray1"></div>
                      )}
                      <div className="flex py-4 gap-x-2 lg:hidden items-start">
                        <Image
                          width={80}
                          height={80}
                          src={product.product_thumb}
                          alt=""
                          className="shrink-0"
                        />
                        <div className="grow flex-col flex gap-y-3">
                          <div className="flex justify-between">
                            <h2 className="line-clamp-2">
                              {product.product_name}
                            </h2>
                            <span className="w-5 text-right shrink-0">
                              ({quantity})
                            </span>
                          </div>
                          <div className="flex sm:flex-row flex-col justify-between">
                            <div>
                              Doanh thu đơn hàng:{" "}
                              <span className="text-red">
                                {formatPriceVND(price)}
                              </span>
                            </div>
                            <div>
                              Thời gian tạo: {formatDate(order.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
OrderSellerPage.Layout = SellerLayout;
