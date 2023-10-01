import { shopApi } from "@/api-client";
import {
  ConfirmModal,
  Menus,
  Modal,
  Pagination,
  Spinner,
} from "@/components/common";
import { Checkbox } from "@/components/common/checkbox";
import Table from "@/components/common/table";
import { Shop } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ShopRow } from "./shop-row";

export function ShopTable() {
  const { query } = useRouter();
  const [listshop, setListshop] = useState<
    (Shop & {
      checked: boolean;
    })[]
  >([]);

  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: ["admin-shop", query],
    queryFn: () => shopApi.getAllShop(query),
    staleTime: 30,
  });
  useEffect(() => {
    if (!data?.metadata) return;
    setListshop(
      () =>
        data?.metadata.shops.map((shop) => ({
          ...shop,
          checked: false,
        })) || []
    );
  }, [data]);
  const listIdChecked = listshop
    .filter((shop) => shop.checked)
    .map((shop) => shop._id);
  const isCheckedAll =
    listshop.every((shop) => shop.checked) && listshop.length > 0;
  const mutationActive = useMutation({
    mutationFn: (ids: string[]) => shopApi.activeShop(ids),
    onSuccess: () => {
      refetch();
    },
  });
  const mutationInActive = useMutation({
    mutationFn: (ids: string[]) => shopApi.inActiveShop(ids),
    onSuccess: () => {
      refetch();
    },
  });
  const handleCheckedAll = () => {
    setListshop(() =>
      listshop.map((shop) => ({ ...shop, checked: !isCheckedAll }))
    );
  };
  const handleActiveAll = () => {
    if (listIdChecked.length <= 0) return;
    mutationActive.mutate(listIdChecked);
  };
  const handleInActiveAll = () => {
    if (listIdChecked.length <= 0) return;
    mutationInActive.mutate(listIdChecked);
  };
  const handleActive = (id: string) => {
    mutationActive.mutate([id]);
  };
  const handleInActive = (id: string) => {
    mutationInActive.mutate([id]);
  };
  const handleChecked = (id: string, checked: boolean) => {
    setListshop(() =>
      listshop.map((shop) => {
        if (shop._id === id) {
          shop.checked = checked;
        }
        return shop;
      })
    );
  };

  const { page, total_pages } = data?.metadata.pagination || {};
  if (isLoading || isFetching) {
    return <Spinner />;
  }
  return (
    <Modal>
      <Menus>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {query.status === "inactive" && (
              <Modal.Open opens="active-all">
                <button
                  disabled={listIdChecked.length <= 0}
                  className="rounded-md text-sm py-2 px-3 text-grey-0 bg-blue-200"
                >
                  Active
                </button>
              </Modal.Open>
            )}
            {query.status === "active" && (
              <Modal.Open opens="inactive-all">
                <button
                  disabled={listIdChecked.length <= 0}
                  className="rounded-md text-sm py-2 px-3 text-grey-0 bg-red-100"
                >
                  Inactive
                </button>
              </Modal.Open>
            )}
            <Modal.Window name="active-all">
              <ConfirmModal
                label="Xác nhận"
                onConfirm={handleActiveAll}
                isLoading={mutationActive.isLoading}
              ></ConfirmModal>
            </Modal.Window>
            <Modal.Window name="inactive-all">
              <ConfirmModal
                label="Xác nhận"
                onConfirm={handleInActiveAll}
                isLoading={mutationInActive.isLoading}
              ></ConfirmModal>
            </Modal.Window>
          </div>
          <Table columns="3fr 1fr 1fr 1rem">
            <Table.Header>
              <div>Shop</div>
              <div>Ngày tạo</div>
              <div>Trạng thái</div>
              <div></div>
            </Table.Header>
            <Table.Body
              isLoading={isLoading || isFetching}
              data={listshop || []}
              render={(shop) => (
                <ShopRow
                  key={shop._id}
                  shop={shop}
                  handleChecked={handleChecked}
                  handleActive={handleActive}
                  handleInActive={handleInActive}
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
        </div>
      </Menus>
    </Modal>
  );
}
