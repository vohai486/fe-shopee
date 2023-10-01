import Table from "@/components/common/table";
import { InventoryRow } from "./inventory-row";
import { inventoryApi } from "@/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Menus, Pagination, Spinner } from "@/components/common";
import { toast } from "react-toastify";

export function InventoryTable() {
  const { query, push, pathname } = useRouter();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["inventory", query],
    queryFn: () => inventoryApi.manageInventory(query),
    staleTime: 60,
  });

  const page = data?.metadata.pagination.page;
  const total_pages = data?.metadata.pagination.total_pages;

  if (isLoading || isFetching) {
    return <Spinner />;
  }
  return (
    <Menus>
      <Table columns="3fr 1.5fr 1.5fr 1fr 2rem">
        <Table.Header>
          <div>Sản phẩm</div>
          <div>Số bán 7 ngày qua</div>
          <div>Số bán 30 ngày qua</div>
          <div>Tồn kho</div>
          <div></div>
        </Table.Header>
        <Table.Body
          isLoading={isLoading || isFetching}
          data={data?.metadata.inventories || []}
          render={(inventory) => (
            <InventoryRow key={inventory._id} inventory={inventory} />
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
