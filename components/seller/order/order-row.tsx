import { ConfirmModal, Menus, Modal } from "@/components/common";
import Table from "@/components/common/table";
import { STATUS_ORDER } from "@/constants";
import { Order } from "@/types";
import { formatDate, formatPriceVND, getStatusOrder } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";

interface OrderRowProps {
  handleConfirm: (id: string) => void;
  handleShipped: (id: string) => void;
  handleCancel: (id: string, payload: { userId: string }) => void;
  handleDelivered: (id: string) => void;
  order: Order;
}

export function OrderRow({
  order,
  handleConfirm,
  handleDelivered,
  handleShipped,
  handleCancel,
}: OrderRowProps) {
  const { query, push } = useRouter();
  return (
    <div className="pb-4 mt-7 border border-box bg-box rounded-md">
      <div className="py-4 px-6  border-b border-box rounded-md flex items-center justify-between">
        <div className="flex gap-x-2 items-center shrink-0  ">
          <div className="bg-grey-700 dark:bg-grey-700-dark rounded-full shrink-0 w-8 h-8  overflow-hidden">
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
        <div className="flex items-center gap-5">
          <div>ID đơn hàng: {order._id}</div>
          <span className="bg-brand-600 p-1 rounded-md">
            {getStatusOrder(order.order_status)}
          </span>
        </div>
      </div>
      {order.order_products.map(({ price, product, quantity }, idx) => (
        <div key={product._id}>
          <Table.Row>
            <div>
              <div className="grow flex gap-x-2">
                <Image
                  width={80}
                  height={80}
                  src={product.product_thumb}
                  alt=""
                />
                <div>
                  <p className="line-clamp-2">{product.product_name}</p>
                </div>
              </div>
              <div className="shrink-0"> x {quantity}</div>
            </div>
            <div>{formatPriceVND(price)}</div>
            <div>{formatDate(order.createdAt)}</div>
            <div>
              {query.status === STATUS_ORDER.DELIVERED &&
              order.order_deliveredAt
                ? formatDate(order.order_deliveredAt)
                : order.order_isPaid
                ? "Đã thanh toán"
                : "Chưa thanh toán"}
            </div>
            <Modal>
              <Menus.Menu>
                <Menus.Toggle id={order._id} />
                <Menus.List id={order._id}>
                  <Menus.Button
                    onClick={() => push(`/seller/order/${order._id}`)}
                    icon={
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
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    }
                  >
                    Xem chi tiết
                  </Menus.Button>
                  {order.order_status === STATUS_ORDER.PENDING && (
                    <Modal.Open opens={`confirm-${order._id}`}>
                      <Menus.Button
                        icon={
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
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        }
                      >
                        Xác nhận
                      </Menus.Button>
                    </Modal.Open>
                  )}

                  {order.order_status === STATUS_ORDER.CONFIRMED && (
                    <Modal.Open opens={`shipped-${order._id}`}>
                      <Menus.Button
                        icon={
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
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        }
                      >
                        Đã lấy hàng
                      </Menus.Button>
                    </Modal.Open>
                  )}
                  {(order.order_status === STATUS_ORDER.PENDING ||
                    order.order_status === STATUS_ORDER.CONFIRMED) && (
                    <Modal.Open opens={`cancelled-${order._id}`}>
                      <Menus.Button
                        icon={
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
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        }
                        // onClick={() =>
                        //   handleCancel(order._id, {
                        //     userId: order.order_user._id,
                        //   })
                        // }
                      >
                        Hủy Đơn
                      </Menus.Button>
                    </Modal.Open>
                  )}

                  {order.order_status === STATUS_ORDER.SHIPPED && (
                    <Modal.Open opens={`delivered-${order._id}`}>
                      <Menus.Button
                        icon={
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
                              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                            />
                          </svg>
                        }
                        // onClick={() => handleDelivered(order._id)}
                      >
                        Đã giao
                      </Menus.Button>
                    </Modal.Open>
                  )}
                </Menus.List>
                <Modal.Window name={`confirm-${order._id}`}>
                  <ConfirmModal
                    label="Xác nhận đơn hàng"
                    onConfirm={() => handleConfirm(order._id)}
                  ></ConfirmModal>
                </Modal.Window>
                <Modal.Window name={`shipped-${order._id}`}>
                  <ConfirmModal
                    label="Xác nhận đã lấy hàng hàng"
                    onConfirm={() => handleShipped(order._id)}
                  ></ConfirmModal>
                </Modal.Window>
                <Modal.Window name={`cancelled-${order._id}`}>
                  <ConfirmModal
                    label="Xác nhận hủy đơn hàng"
                    onConfirm={() =>
                      handleCancel(order._id, {
                        userId: order.order_user._id,
                      })
                    }
                  ></ConfirmModal>
                </Modal.Window>
                <Modal.Window name={`delivered-${order._id}`}>
                  <ConfirmModal
                    label="Xác nhận đã giao"
                    onConfirm={() => handleDelivered(order._id)}
                  ></ConfirmModal>
                </Modal.Window>
              </Menus.Menu>
            </Modal>
          </Table.Row>
        </div>
      ))}
    </div>
  );
}
