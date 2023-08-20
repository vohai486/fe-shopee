import { voucherApi } from "@/api-client";
import { Pagination } from "@/components/common";
import { FormVoucher } from "@/components/seller";
import { SellerLayout } from "@/components/layouts";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

const options = [
  {
    status: "",
    label: "Tất cả",
  },
  { status: "happenning", label: "Đang diễn ra" },
  { status: "upcoming", label: "Sắp diễn ra" },
  { status: "finished", label: "Đã kết thúc" },
];

export default function VoucherSellerPage() {
  const [showModal, setShowModal] = useState(false);
  const { query, pathname, push } = useRouter();
  const [selectVoucher, setSelectVoucher] = useState<string>("");
  const { data, refetch } = useQuery({
    queryKey: ["voucher", query],
    queryFn: () => voucherApi.getVoucherForShop(query),
  });
  const deleteMutation = useMutation({
    mutationFn: voucherApi.deleteVoucher,
    onSuccess: () => {
      toast.success("Xóa thành công");
      refetch();
    },
  });
  const handleDeleteVoucher = (id: string) => deleteMutation.mutate(id);
  const onSuccessAddVoucher = () => {
    refetch();
  };
  const handlePrevPage = () => {
    if (!query.page || +query.page === 1) return;
    push({
      pathname,
      query: {
        ...query,
        page: Number(query.page) - 1,
      },
    });
  };
  const handleNextPage = () => {
    if (!query.page || +query.page === data?.metadata.pagination.total_pages)
      return;
    push({
      pathname,
      query: {
        ...query,
        page: Number(query.page) + 1,
      },
    });
  };
  return (
    <div className=" text-sm">
      <div className="text-right mb-3">
        <button
          onClick={() => setShowModal(true)}
          className="text-white bg-orange py-2 px-4 rounded-sm"
        >
          Thêm voucher
        </button>
      </div>
      {showModal && (
        <FormVoucher
          onSuccessAddVoucher={onSuccessAddVoucher}
          onClose={() => {
            setShowModal(false);
            setSelectVoucher("");
          }}
          selectVoucher={selectVoucher}
        />
      )}
      <div className="bg-white px-3 lg:px-6 pb-6 ">
        <div className="flex justify-between items-center">
          <div
            className=" flex overflow-x-scroll  
         cursor-pointer hidden-scroll  flex-nowrap shadow-sm"
          >
            {options.map((item) => (
              <Link
                key={item.status}
                href={{ pathname: pathname, query: { status: item.status } }}
                className={`min-w-[150px] px-2 py-4 text-center  my-auto  ${
                  (query.status === item.status ||
                    (item.status === "" && !query.status)) &&
                  "text-orange border-b-4  font-bold border-orange"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {data?.metadata.pagination && (
            <Pagination
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
              total_pages={data.metadata.pagination.total_pages}
              page={data.metadata.pagination.page}
            />
          )}
        </div>
        <div className="mt-6 border border-gray3">
          <div className="bg-gray px-4 py-3 grid grid-cols-7 text-center">
            <div className="col-span-1 text-left my-auto">Tên Voucher</div>
            <div className="col-span-1 my-auto">Giảm giá</div>
            <div className="col-span-1 my-auto">Tổng lượt sử dụng tối đa</div>
            <div className="col-span-1 my-auto">Đã dùng</div>
            <div className="col-span-1 my-auto">Trạng thái</div>
            <div className="col-span-1 my-auto">Thời gian lưu mã (ngày)</div>
            <div className="col-span-1 my-auto">Thao tác</div>
          </div>

          {data?.metadata &&
            data.metadata.data.map((voucher, idx) => (
              <div
                key={voucher._id}
                className={`px-4 py-3 grid grid-cols-7 text-center border-t border-gray3 `}
              >
                <div className="col-span-1 text-left">
                  {voucher.voucher_name}
                </div>
                <div className="col-span-1">{voucher.voucher_value}</div>
                <div className="col-span-1">{voucher.voucher_max_uses}</div>
                <div className="col-span-1">{voucher.numUsed}</div>
                <div className="col-span-1">
                  <div
                    className={`${
                      voucher.status === "upcoming" && "text-yellow-400"
                    }
                    ${voucher.status === "happenning" && "text-orange"}
                    ${voucher.status === "finished" && "text-red1"}`}
                  >
                    {voucher.status === "upcoming"
                      ? "Sắp diễn ra"
                      : voucher.status === "happenning"
                      ? "Đang diễn ra"
                      : "Hết hạn"}
                  </div>
                </div>
                <div className="col-span-1">{voucher.codeRetentionTime}</div>
                <div className="col-span-1 cursor-pointer">
                  <div
                    className="text-blue"
                    onClick={() => {
                      setSelectVoucher(voucher._id), setShowModal(true);
                    }}
                  >
                    Sửa
                  </div>
                  <div
                    className="text-red1"
                    onClick={() => handleDeleteVoucher(voucher._id)}
                  >
                    Xóa
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
VoucherSellerPage.Layout = SellerLayout;
