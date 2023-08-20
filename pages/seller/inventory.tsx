import { inventoryApi } from "@/api-client";
import { Pagination } from "@/components/common";
import { SellerLayout } from "@/components/layouts";
import { FormImportProduct } from "@/components/seller";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

const options = [
  {
    status: "",
    label: "Còn hàng",
  },
  {
    status: "out-of-stock",
    label: "Hết hàng",
  },
  {
    status: "low-in-stock",
    label: "Sắp hết hàng",
  },
];
export default function InvertorySellerPage() {
  const { query, pathname, push } = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [idSelect, setIdSelect] = useState("");
  const { data, refetch } = useQuery({
    queryKey: ["inventory", query],
    queryFn: () => inventoryApi.manageInventory(query),
    staleTime: 60,
  });
  const mutation = useMutation({
    mutationFn: inventoryApi.importProduct,
    onSuccess: () => {
      toast.success("Thêm thành công");
      refetch();
    },
  });
  const handleImport = (quantity: number, price: number) => {
    mutation.mutate({
      productId: idSelect,
      quantity,
      price,
    });
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
    if (!page || +page === 1) return;
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
      {showModal && (
        <FormImportProduct
          handleImport={handleImport}
          idSelect={idSelect}
          onClose={() => {
            setIdSelect("");
            setShowModal(false);
          }}
        />
      )}
      <div className="bg-white px-6 pb-6">
        <h2 className="text-lg py-3 font-medium">Quản lý tồn kho</h2>
        <div className=" flex border-b border-gray3 justify-between">
          <div className="flex">
            {options.map((item) => (
              <Link
                key={item.status}
                href={{ pathname: pathname, query: { status: item.status } }}
                className={` p-4 my-auto  ${
                  (query.status === item.status ||
                    (item.status === "" && !query.status)) &&
                  "text-orange border-b-4  font-bold border-orange"
                }`}
              >
                {item.label}
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
        <div className="mt-6">
          <div>
            <div className="grid grid-cols-6 border text-center border-gray1 bg-gray px-4 py-3">
              <div className="col-span-2 my-auto text-left">Sản phẩm</div>
              <div className="col-span-1 my-auto">Số bán 7 ngày qua</div>
              <div className="col-span-1 my-auto">Số bán 30 ngày qua</div>
              <div className="col-span-1 my-auto">Tồn kho </div>
              <div className="col-span-1 my-auto">Hoạt dộng</div>
            </div>
          </div>
        </div>
        <div className="max-h-[600px] overflow-auto hidden-scroll">
          {data?.metadata &&
            data.metadata.inventories.map((item, idx) => {
              const status =
                item.inven_stock === 0
                  ? "A"
                  : item.inven_stock < 10
                  ? "B"
                  : "C";
              return (
                <div key={item._id}>
                  <div className="text-right pr-3">
                    <span
                      className={` ${
                        status === "A"
                          ? "text-red1 bg-red1/20"
                          : status === "B"
                          ? "text-yellow-400 bg-yellow-400/20"
                          : "text-gray4 bg-gray4/20"
                      }`}
                    >
                      {status === "A"
                        ? "Bổ sung hàng ngay lập tức"
                        : status === "B"
                        ? "Bổ sung hàng sớm"
                        : "Bình thường"}
                    </span>
                  </div>
                  <div
                    className={`grid grid-cols-6 border text-center border-gray1 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray"
                    }  px-4 py-3`}
                  >
                    <div className="col-span-2 flex gap-x-2 text-left">
                      <Image
                        src={item.inven_productId.product_thumb}
                        alt=""
                        width={40}
                        height={40}
                      />
                      <p className="line-clamp-2">
                        {item.inven_productId.product_name}
                      </p>
                    </div>
                    <div className="col-span-1">{item.sell_7_days}</div>
                    <div className="col-span-1">{item.sell_30_days}</div>
                    <div className="col-span-1">{item.inven_stock}</div>
                    <div className="col-span-1">
                      <div
                        className="text-blue cursor-pointer"
                        onClick={() => {
                          setIdSelect(() => item.inven_productId._id);
                          setShowModal(true);
                        }}
                      >
                        Nhập hàng
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
InvertorySellerPage.Layout = SellerLayout;
