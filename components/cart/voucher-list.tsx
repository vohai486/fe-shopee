import { Voucher } from "@/types/voucher.types";
import { formatDateVoucher, formatPriceVND } from "@/utils";
import { Checkbox } from "../common/checkbox";

interface VoucherExtends extends Voucher {
  isChecked: boolean;
}
export interface IVoucherListProps {
  listVoucher: VoucherExtends[];
  handleApplyVoucher: (id: string) => void;
  handleCheckedVoucher: (id: string) => void;
}

export const VoucherList = ({
  listVoucher = [],
  handleApplyVoucher,
  handleCheckedVoucher,
}: IVoucherListProps) => {
  if (listVoucher.length === 0) return null;
  return (
    <div className="flex flex-col gap-y-2">
      {listVoucher
        .sort((a, b) => +b.isChecked - +a.isChecked)
        .map((voucher) => {
          const formatDate = formatDateVoucher(voucher.voucher_end_date);
          return (
            <div
              className={`border  cursor-pointer border-box rounded-md p-2 flex justify-between items-center 
             
              `}
              key={voucher._id}
            >
              <div className="flex flex-col w-3/4">
                <div className="text-base text-title font-medium">
                  {voucher.voucher_name}
                </div>
                <div className="text-sm text-blue-100">
                  Đơn tối thiểu{" "}
                  {formatPriceVND(voucher.voucher_min_order_value)} - Giảm{" "}
                  {formatPriceVND(voucher.voucher_value)}
                </div>
                {voucher.voucher_user_count > 0 && (
                  <div className="w-full mt-2 h-1 relative rounded-sm bg-box overflow-hidden">
                    <div
                      className={`inset-0 absolute bg-blue-200`}
                      style={{
                        width: `${
                          (voucher.voucher_user_count /
                            voucher.voucher_max_uses) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                )}

                <div className="flex text-xs mt-1 text-blue-50">
                  {formatDate.type === "expire" ? (
                    <p className="text-red-100">Hết hạn</p>
                  ) : formatDate.type === "aboutToExpire" ? (
                    <p className="text-red-100">
                      Sắp hết hạn {formatDate.value} giờ
                    </p>
                  ) : (
                    <p>HSD: {formatDate.value}</p>
                  )}
                </div>
              </div>
              <div>
                {voucher.is_apply ? (
                  <Checkbox
                    checked={voucher.isChecked}
                    onChange={() => handleCheckedVoucher(voucher._id)}
                    id={voucher._id}
                  />
                ) : (
                  <button
                    className="bg-blue-200 text-grey-0 px-4 rounded-sm py-1"
                    onClick={() => handleApplyVoucher(voucher._id)}
                  >
                    Lưu
                  </button>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};
