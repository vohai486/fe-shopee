import { productApi } from "@/api-client";
import { Pagination } from "@/components/common";
import { AdminLayout } from "@/components/layouts";
import { Product } from "@/types";
import { formatDate, generateNameId } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ProductAdminPage() {
  const [listProduct, setListProduct] = useState<
    (Pick<Product, "createdAt" | "product_name" | "product_thumb" | "_id"> & {
      checked: boolean;
    })[]
  >([]);
  const { query, pathname, push } = useRouter();
  const { data, refetch } = useQuery({
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
  const isCheckedAll = listProduct.every((product) => product.checked);
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
    if (listProduct.filter((product) => product.checked).length === 0) return;
    mutationVerify.mutate(
      listProduct
        .filter((product) => product.checked)
        .map((product) => product._id)
    );
  };
  const handleVerifyProduct = (productId: string) => {
    mutationVerify.mutate([productId]);
  };

  const { page, total_pages } = data?.metadata.pagination || {};
  const handleNextPage = () => {
    if (!page || !total_pages || +page === +total_pages) return;
    push({
      pathname,
      query: { ...query, page: +page + 1 },
    });
  };
  const handlePrevPage = () => {
    if (!page || +page === 1) return;
    push({
      pathname,
      query: { ...query, page: +page - 1 },
    });
  };

  return (
    <div className=" text-sm">
      <div className=" flex bg-gray1 pr-2 justify-between">
        <div className="flex">
          <Link
            href={{
              pathname,
              query: {},
            }}
            className={`py-3 px-4 ${!query.status && "bg-orange text-white"}`}
          >
            Tất cả
          </Link>
          <Link
            href={{
              pathname,
              query: { status: "wait-verify" },
            }}
            className={`py-3 px-4 ${
              query.status === "wait-verify" && "bg-orange text-white"
            }`}
          >
            Sản phẩm chờ duyệt
          </Link>
          <Link
            href={{
              pathname,
              query: { status: "verify" },
            }}
            className={`py-3 px-4 ${
              query.status === "verify" && "bg-orange text-white"
            }`}
          >
            Sản phẩm đã duyệt
          </Link>
        </div>
        {/* <div>Sản phẩm vi phạm</div> */}
        <Pagination
          page={page || 1}
          total_pages={total_pages || 10}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
        />
      </div>
      <div className="mt-3 text-right">
        {query.status === "wait-verify" && (
          <button
            onClick={handleVerifyProducts}
            className=" py-2 px-3 bg-orange text-white"
          >
            Duyệt tất cả
          </button>
        )}
      </div>
      <div className="mt-3 bg-white p-3">
        <table className="table-auto w-full">
          <thead className="bg-gray1">
            <tr>
              <th className="w-1/12">
                <input
                  id="helper-checkbox"
                  aria-describedby="helper-checkbox-text"
                  type="checkbox"
                  className="w-4 h-4 accent-orange"
                  checked={isCheckedAll}
                  onChange={() => {
                    handleCheckedAll();
                  }}
                />
              </th>
              <th className="py-3 w-7/12">Sản phẩm</th>
              <th className="py-3 w-2/12">Ngày tạo</th>
              <th className="py-3 w-2/12">Action</th>
            </tr>
          </thead>
          <tbody>
            {listProduct.map((product, idx) => (
              <tr
                key={product._id}
                className={` ${idx % 2 === 1 && "bg-gray1 "}`}
              >
                <td className="text-center">
                  <input
                    id="helper-checkbox"
                    aria-describedby="helper-checkbox-text"
                    type="checkbox"
                    className="w-4 h-4 accent-orange"
                    checked={product.checked}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChecked(product._id, e.target.checked);
                    }}
                  />
                </td>
                <td className="py-3 px-3">
                  <div className="flex gap-x-2">
                    <Image
                      src={product.product_thumb}
                      alt=""
                      width={40}
                      height={40}
                    />
                    <p className="line-clamp-3">{product.product_name}</p>
                  </div>
                </td>
                <td className="text-center">{formatDate(product.createdAt)}</td>
                <td className="text-center cursor-pointer">
                  {query.status === "wait-verify" && (
                    <span
                      className="text-blue"
                      onClick={() => handleVerifyProduct(product._id)}
                    >
                      Verify
                    </span>
                  )}
                  {query.status !== "wait-verify" && (
                    <Link
                      target="_blank"
                      href={`/${generateNameId({
                        name: product.product_name,
                        id: product._id,
                      })}`}
                      className="text-blue"
                    >
                      Xem
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
ProductAdminPage.Layout = AdminLayout;
