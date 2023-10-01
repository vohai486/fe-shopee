import { voucherApi } from "@/api-client";
import Table from "@/components/common/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { VoucherRow } from "./voucher-row";
import { Menus, Pagination, Spinner } from "@/components/common";
import { AddVoucher } from "./add-voucher";
import { toast } from "react-toastify";

export function VoucherTable() {
  const { query } = useRouter();
  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: ["voucher", query],
    queryFn: () => voucherApi.getVoucherForShop(query),
  });
  const page = data?.metadata.pagination.page;
  const total_pages = data?.metadata.pagination.total_pages;
  const deleteMutation = useMutation({
    mutationFn: voucherApi.deleteVoucher,
    onSuccess: () => {
      toast.success("Xóa thành công");
      refetch();
    },
  });
  const handleDeleteVoucher = (id: string) => {
    deleteMutation.mutate(id);
  };
  if (isLoading || isFetching) {
    return <Spinner />;
  }
  return (
    <Menus>
      <div>
        <AddVoucher />
      </div>
      <Table columns="3fr 1fr 1.5fr 1fr 1.5fr 1fr 2rem">
        <Table.Header>
          <div>Tên Voucher</div>
          <div>Giảm giá</div>
          <div>Sử dụng tối đa</div>
          <div>Đã dùng</div>
          <div>Trạng thái</div>
          <div>Số Ngày</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={data?.metadata.data || []}
          isLoading={isLoading || isFetching}
          render={(voucher) => (
            <VoucherRow
              handleDeleteVoucher={handleDeleteVoucher}
              key={voucher._id}
              voucher={voucher}
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
