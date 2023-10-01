import Table from "@/components/common/table";
import { Order } from "@/types";
import React from "react";
import { OrderRow } from "./order-row";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { checkoutApi } from "@/api-client";
import { Menus, Pagination, Spinner } from "@/components/common";

export function OrderTable() {
  const { query, pathname, push } = useRouter();
  const { data, refetch, isLoading, isFetching } = useQuery({
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

  const page = data?.metadata?.pagination?.page || 1;
  const total_pages = data?.metadata?.pagination?.total_pages || 1;

  if (isLoading || isFetching) {
    return <Spinner />;
  }
  return (
    <Menus>
      <Table columns="3fr 1.5fr 1.5fr .8fr 2rem">
        <Table.Header>
          <div>Sản phẩm</div>
          <div>Tổng tiền</div>
          <div>Thời gian tạo</div>
          <div>Thanh toán</div>
          <div></div>
        </Table.Header>
        <Table.Body
          isLoading={isLoading || isFetching}
          data={data?.metadata.orders || []}
          render={(order) => (
            <OrderRow
              key={order._id}
              handleConfirm={handleConfirm}
              handleShipped={handleShipped}
              handleCancel={handleCancel}
              handleDelivered={handleDelivered}
              order={order}
            />
          )}
        ></Table.Body>
        {total_pages && total_pages > 1 ? (
          <Table.Footer>
            <Pagination page={page || 1} total_pages={total_pages || 1}>
              <Pagination.Maxi />
            </Pagination>
          </Table.Footer>
        ) : null}
      </Table>
    </Menus>
  );
}
