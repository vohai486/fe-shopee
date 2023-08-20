import { productApi } from "@/api-client";
import { Pagination } from "@/components/common";
import { SellerLayout } from "@/components/layouts";
import { FormProduct } from "@/components/seller";
import { Product } from "@/types";
import { formatDate, formatPriceVND } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface IProps {}

const options = [
  {
    type: "",
    label: "Tất cả",
  },
  {
    type: "published",
    label: "Đang hoạt động",
  },
  {
    type: "out-stock",
    label: "Hết hàng",
  },
  {
    type: "wait-vefify",
    label: "Chờ duyệt",
  },
  {
    type: "draft",
    label: "Đã ẩn",
  },
];

export default function ProductSellerPage(props: IProps) {
  const [showModal, setShowModal] = useState(false);
  const [productList, setProductList] = useState<
    (Product & { checked: boolean })[]
  >([]);
  const { pathname, query, push } = useRouter();
  const { data, refetch } = useQuery({
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
  const handlePublishProduct = (id: string) => {
    mutationPublishProduct.mutate([id]);
  };
  const handlePublishListProduct = (listIdChecked: string[]) => {
    mutationPublishProduct.mutate(listIdChecked);
  };
  const handleUnPublishListProduct = (listIdChecked: string[]) => {
    mutationUnPublishProduct.mutate(listIdChecked);
  };
  const handleUnPublishProduct = (id: string) => {
    mutationUnPublishProduct.mutate([id]);
  };
  const handleClickAll = () => {
    const listIdChecked = productList
      .filter((product) => product.checked)
      .map((product) => product._id);
    if (listIdChecked.length === 0) return;
    if (query.type === "published") {
      handleUnPublishListProduct(listIdChecked);
    }
    if (query.type === "draft") {
      handlePublishListProduct(listIdChecked);
    }
  };

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
  const { page, total_pages } = data?.metadata.pagination || {};

  const handleNextPage = () => {
    if (!page || !total_pages || +page === +total_pages) return;
    push({
      pathname,
      query: {
        ...query,
        page: +page + 1,
      },
    });
  };
  const handlePrevPage = () => {
    if (!page || !total_pages || +page === 1) return;
    push({
      pathname,
      query: {
        ...query,
        page: +page - 1,
      },
    });
  };
  return (
    <div className="text-sm">
      <div className="text-right mb-3">
        <button
          onClick={() => setShowModal(true)}
          className="text-white bg-orange py-2 px-4 rounded-sm"
        >
          Thêm sản phẩm
        </button>
      </div>
      {showModal && <FormProduct onClose={() => setShowModal(false)} />}
      <div className="bg-white shadow-sm ">
        <div className="flex  px-6 justify-between border-b border-gray1">
          <div className=" flex ">
            {options.map(({ type, label }) => (
              <Link
                key={label}
                href={{
                  pathname,
                  query: type ? { type: type } : {},
                }}
                className={`p-4 pb-3  my-auto border-b-4   ${
                  type === query.type || (type === "" && !query.type)
                    ? "  border-orange text-orange font-bold"
                    : "border-transparent"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          <Pagination
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            page={page}
            total_pages={total_pages}
          />
        </div>
        <div className="px-6 py-3">
          {(query.type === "draft" || query.type === "published") && (
            <div className="text-right my-3">
              <button
                onClick={handleClickAll}
                className="bg-orange py-2 px-3 text-white rounded-sm"
              >
                {query.type === "draft" && "Duyệt tất cả"}
                {query.type === "published" && "Ẩn tất cả"}
              </button>
            </div>
          )}

          <div className=" border border-gray3">
            <div className="grid grid-cols-9 text-center border-b border-gray3 bg-gray px-4 py-3">
              <div className="col-span-1 text-center my-auto">
                <input
                  id="helper-checkbox"
                  aria-describedby="helper-checkbox-text"
                  type="checkbox"
                  className="checkbox rounded-sm checkbox-accent w-4 h-4"
                  checked={isCheckedAll}
                  onChange={() => {
                    handleCheckedAll();
                  }}
                />
              </div>
              <div className="col-span-2 text-left">Sản phẩm</div>
              <div className="col-span-1">Danh mục</div>
              <div className="col-span-1">Thương Hiệu</div>
              <div className="col-span-1">Giá bán</div>
              <div className="col-span-1">Ngày tạo</div>
              <div className="col-span-1">Ngày cập nhập gần nhất</div>
              <div className="col-span-1">Thao tác</div>
            </div>
            <div className="px-4 max-h-[700px] overflow-auto hidden-scroll">
              {productList.map((product, idx) => (
                <div
                  className={`grid grid-cols-9 text-center py-3 ${
                    idx !== 0 && "border-t border-gray3"
                  }`}
                  key={product._id}
                >
                  <div className="col-span-1 my-auto">
                    <input
                      id="helper-checkbox"
                      aria-describedby="helper-checkbox-text"
                      type="checkbox"
                      className="checkbox rounded-sm checkbox-accent w-4 h-4"
                      checked={product.checked}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChecked(product._id, e.target.checked)
                      }
                    />
                  </div>
                  <div className="col-span-2 text-left flex gap-x-2">
                    <Image
                      src={product.product_thumb}
                      alt=""
                      width={80}
                      height={80}
                    />
                    <div className=" grow">
                      <p className="line-clamp-3">{product.product_name}</p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    {product.product_category.category_name}
                  </div>
                  <div className="col-span-1">{product.product_brand}</div>
                  <div className="col-span-1">
                    {formatPriceVND(product.product_price)}
                  </div>
                  <div className="col-span-1">
                    {formatDate(product.createdAt)}
                  </div>
                  <div className="col-span-1">
                    {formatDate(product.updatedAt)}
                  </div>
                  <div className="col-span-1 cursor-pointer">
                    {query.type === "published" && (
                      <div
                        className="text-blue"
                        onClick={() => handleUnPublishProduct(product._id)}
                      >
                        Ẩn sản phẩm
                      </div>
                    )}
                    {query.type === "out-stock" && (
                      <div className="text-blue">Nhập thêm hàng</div>
                    )}
                    {query.type === "draft" && (
                      <div
                        className="text-blue"
                        onClick={() => handlePublishProduct(product._id)}
                      >
                        Hiện sản phẩm
                      </div>
                    )}
                    <div className="text-blue">Sửa sản phẩm</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
ProductSellerPage.Layout = SellerLayout;
