import { productApi } from "@/api-client";
import {
  ConfirmModal,
  Menus,
  Modal,
  Pagination,
  Spinner,
} from "@/components/common";
import Table from "@/components/common/table";
import { Product } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProductRow } from "./product-row";
import { AddProduct } from "./add-product";
import { Checkbox } from "@/components/common/checkbox";

export function ProductTable() {
  const [productList, setProductList] = useState<
    (Product & { checked: boolean })[]
  >([]);
  const { pathname, query, push } = useRouter();
  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: ["product-shop", query],
    queryFn: () => productApi.getAllProductByShop(query),
    staleTime: 60,
  });
  const mutationPublishProduct = useMutation({
    mutationFn: productApi.publishProduct,
    onSuccess: () => {
      toast.success("Đăng bán sản phẩm thành công");
      refetch();
    },
  });
  const mutationUnPublishProduct = useMutation({
    mutationFn: productApi.unPublishProduct,
    onSuccess: () => {
      toast.success("Ẩn sản phẩm ");
      refetch();
    },
  });
  useEffect(() => {
    if (!data?.metadata) return;
    setProductList(
      () =>
        data.metadata.products.map((product) => ({
          ...product,
          checked: false,
        })) || []
    );
  }, [data]);
  const isCheckedAll =
    productList.every((product) => product.checked) && productList.length > 0;
  const page = data?.metadata?.pagination.page;
  const total_pages = data?.metadata?.pagination.total_pages;
  const listIdChecked = productList
    .filter((product) => product.checked)
    .map((product) => product._id);

  const handleCheckedAll = () => {
    setProductList((prev) =>
      prev.map((product) => ({ ...product, checked: !isCheckedAll } || []))
    );
  };
  const handleChecked = (id: string, checked: boolean) => {
    setProductList((prev) =>
      prev.map((product) => {
        if (product._id === id) {
          product.checked = checked;
        }
        return product;
      })
    );
  };
  const handleUnPublishProduct = (id: string) => {
    mutationUnPublishProduct.mutate([id]);
  };
  const handlePublishProduct = (id: string) => {
    mutationPublishProduct.mutate([id]);
  };
  const handlePublishListProduct = (listIdChecked: string[]) => {
    mutationPublishProduct.mutate(listIdChecked);
  };
  const handleUnPublishListProduct = (listIdChecked: string[]) => {
    mutationUnPublishProduct.mutate(listIdChecked);
  };
  if (isLoading || isFetching) {
    return <Spinner />;
  }
  return (
    <Modal>
      <Menus>
        <div className="flex flex-col gap-4">
          <div className="flex gap-x-3">
            <AddProduct />

            {query.type === "published" && (
              <Modal.Open opens="published-all">
                <button
                  disabled={listIdChecked.length <= 0}
                  className="  text-sm py-3 px-4 rounded-md bg-red-100 text-grey-0 "
                >
                  Ẩn
                </button>
              </Modal.Open>
            )}
            {query.type === "draft" && (
              <Modal.Open opens="draft-all">
                <button
                  disabled={listIdChecked.length <= 0}
                  className=" text-sm py-3 px-4 rounded-md bg-green-50 text-grey-0 "
                >
                  Hiện
                </button>
              </Modal.Open>
            )}
            <Modal.Window name="published-all">
              <ConfirmModal
                isLoading={mutationUnPublishProduct.isLoading}
                onConfirm={() => handleUnPublishListProduct(listIdChecked)}
                label="Xác nhận ẩn sản phẩm đã chọn"
              />
            </Modal.Window>
            <Modal.Window name="draft-all">
              <ConfirmModal
                isLoading={mutationPublishProduct.isLoading}
                onConfirm={() => handlePublishListProduct(listIdChecked)}
                label="Xác nhận hiện sản phẩm đã chọn"
              />
            </Modal.Window>
          </div>
          <Table columns="1rem 3fr 1fr 1fr 1fr 1fr 1rem">
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
              <div>Danh mục</div>
              <div>Thương Hiệu</div>
              <div>Giá bán</div>
              <div>Ngày tạo</div>
              <div></div>
            </Table.Header>
            <Table.Body
              data={productList || []}
              isLoading={isLoading || isFetching}
              render={(product) => (
                <ProductRow
                  key={product._id}
                  handlePublishProduct={handlePublishProduct}
                  handleUnPublishProduct={handleUnPublishProduct}
                  handleChecked={handleChecked}
                  product={product}
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
