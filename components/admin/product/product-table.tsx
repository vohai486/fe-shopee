import { productApi } from "@/api-client";
import {
  ConfirmModal,
  Menus,
  Modal,
  Pagination,
  Spinner,
} from "@/components/common";
import { Checkbox } from "@/components/common/checkbox";
import Table from "@/components/common/table";
import { Product } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProductRow } from "./product-row";

export function ProductTable() {
  const { query, pathname, push } = useRouter();

  const [listProduct, setListProduct] = useState<
    (Product & {
      checked: boolean;
    })[]
  >([]);
  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: ["admin-product", query],
    queryFn: () => productApi.getAllProductByAdmin(query),
    staleTime: 30,
  });
  const mutationVerify = useMutation({
    mutationFn: productApi.verifyProduct,
    onSuccess: () => {
      refetch();
      toast.success("Thành công");
    },
  });
  const mutationUnVerify = useMutation({
    mutationFn: productApi.unVerifyProduct,
    onSuccess: () => {
      refetch();
      toast.success("Thành công");
    },
  });
  useEffect(() => {
    if (!data?.metadata) return;
    setListProduct(
      () =>
        data?.metadata.products.map((product) => ({
          ...product,
          checked: false,
        })) || []
    );
  }, [data]);

  const listIdChecked = listProduct
    .filter((product) => product.checked)
    .map((product) => product._id);
  const isCheckedAll =
    listProduct.every((product) => product.checked) && listProduct.length > 0;

  const handleCheckedAll = () => {
    setListProduct(() =>
      listProduct.map((product) => ({ ...product, checked: !isCheckedAll }))
    );
  };
  const handleChecked = (productId: string, checked: boolean) => {
    setListProduct(() =>
      listProduct.map((product) => {
        if (product._id === productId) {
          product.checked = checked;
        }
        return product;
      })
    );
  };

  const handleVerifyProducts = () => {
    if (listIdChecked.length <= 0) return;
    mutationVerify.mutate(
      listProduct
        .filter((product) => product.checked)
        .map((product) => product._id)
    );
  };
  const handleVerifyProduct = (productId: string) => {
    mutationVerify.mutate([productId]);
  };
  const handleUnVerifyProducts = () => {
    if (listIdChecked.length <= 0) return;
    mutationUnVerify.mutate(
      listProduct
        .filter((product) => product.checked)
        .map((product) => product._id)
    );
  };
  const handleUnVerifyProduct = (productId: string) => {
    mutationUnVerify.mutate([productId]);
  };
  const { page, total_pages } = data?.metadata.pagination || {};
  if (isLoading || isFetching) {
    return <Spinner />;
  }
  return (
    <Modal>
      <Menus>
        <div className="flex flex-col gap-4">
          <div>
            {query.status === "wait-verify" && (
              <Modal.Open opens="verify-all">
                <button
                  className="rounded-md text-sm py-2 px-3 text-grey-0 bg-blue-200"
                  disabled={listIdChecked.length <= 0}
                >
                  Duyệt
                </button>
              </Modal.Open>
            )}
            {query.status === "verify" && (
              <Modal.Open opens="un-verify-all">
                <button
                  className="rounded-md text-sm py-2 px-3 text-grey-0 bg-red-200"
                  disabled={listIdChecked.length <= 0}
                >
                  Hủy Duyệt
                </button>
              </Modal.Open>
            )}
            <Modal.Window name="verify-all">
              <ConfirmModal
                isLoading={mutationVerify.isLoading}
                label="Xác nhận Duyệt"
                onConfirm={handleVerifyProducts}
              ></ConfirmModal>
            </Modal.Window>
            <Modal.Window name="un-verify-all">
              <ConfirmModal
                isLoading={mutationUnVerify.isLoading}
                label="Xác nhận Duyệt"
                onConfirm={handleUnVerifyProducts}
              ></ConfirmModal>
            </Modal.Window>
          </div>
          <Table columns="1rem 3fr 1fr 1rem">
            <Table.Header>
              <div>
                <Checkbox
                  aria-describedby="helper-checkbox-text"
                  type="checkbox"
                  checked={isCheckedAll}
                  onChange={handleCheckedAll}
                />
              </div>
              <div>Sản phẩm</div>
              <div>Ngày tạo</div>
              <div></div>
            </Table.Header>
            <Table.Body
              isLoading={isLoading || isFetching}
              data={listProduct || []}
              render={(product) => (
                <ProductRow
                  key={product._id}
                  handleChecked={handleChecked}
                  product={product}
                  handleVerifyProduct={handleVerifyProduct}
                  handleUnVerifyProduct={handleUnVerifyProduct}
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
