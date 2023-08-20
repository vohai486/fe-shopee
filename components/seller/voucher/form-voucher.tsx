import { voucherApi } from "@/api-client";
import { PayloadAddVoucher } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAfter, isValid } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Button } from "../../common/button";
import { InputDateField, InputField, InputNumberField } from "../../form";
import { ModalPortal } from "@/components/common";
interface FormProductProps {
  onClose: () => void;
  onSuccessAddVoucher: () => void;
  selectVoucher: string;
}

type FormData = Omit<PayloadAddVoucher, "_id">;

function testDate(this: yup.TestContext<yup.AnyObject>) {
  const { voucher_start_date, voucher_end_date } = this.parent;
  if (!isValid(voucher_start_date) || !isValid(voucher_end_date)) {
    return false;
  }
  return isAfter(voucher_end_date, voucher_start_date);
}

const schema = yup.object().shape({
  voucher_code: yup
    .string()
    .required("Không được để trống")
    .max(50, "Không quá 50 kí tự")
    .min(6, "Từ 6 kí tự trở lên"),
  voucher_name: yup
    .string()
    .required("Không được để trống")
    .max(50, "Không quá 50 kí tự"),
  voucher_start_date: yup
    .date()
    .test({
      name: "date",
      test: testDate,
      message: "Ngày bắt đầu và kết thúc không hợp lệ",
    })
    .required("Không được để trống"),
  voucher_end_date: yup
    .date()
    .test({
      name: "date",
      test: testDate,
      message: "Ngày không hợp lệ",
    })
    .required("Không được để trống"),
  voucher_min_order_value: yup
    .number()
    .min(1, "Số phải lớn hơn 0")
    .required("Không được bỏ trống"),
  voucher_value: yup
    .number()
    .min(1, "Số phải lớn hơn 0")
    .required("Không được bỏ trống"),
  voucher_max_uses: yup
    .number()
    .min(1, "Số phải lớn hơn 0")
    .required("Không được bỏ trống"),
  voucher_max_uses_per_user: yup
    .number()
    .min(1, "Số phải lớn hơn 0")
    .required("Không được bỏ trống"),
});
export function FormVoucher({
  onClose,
  onSuccessAddVoucher,
  selectVoucher,
}: FormProductProps) {
  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    shouldFocusError: false,
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { data } = useQuery({
    queryKey: ["voucher-detail", selectVoucher],
    queryFn: () => voucherApi.getDetailVoucher(selectVoucher),
    enabled: !!selectVoucher,
  });
  useEffect(() => {
    if (!data?.metadata._id) return;
    const {
      voucher_code,
      voucher_end_date,
      voucher_name,
      voucher_value,
      voucher_min_order_value,
      voucher_start_date,
      voucher_max_uses,
      voucher_max_uses_per_user,
    } = data.metadata;
    setValue("voucher_code", voucher_code);
    setValue("voucher_name", voucher_name);
    setValue("voucher_end_date", new Date(voucher_end_date));
    setValue("voucher_start_date", new Date(voucher_start_date));
    setValue("voucher_max_uses", voucher_max_uses);
    setValue("voucher_max_uses_per_user", voucher_max_uses_per_user);
    setValue("voucher_min_order_value", voucher_min_order_value);
    setValue("voucher_value", voucher_value);
  }, [data?.metadata, setValue]);
  const addVoucherMutation = useMutation({
    mutationFn: voucherApi.addVoucher,
    onSuccess: () => {
      toast.success("Thêm voucher thành công");
      onClose();
      onSuccessAddVoucher();
    },
  });
  const updateVoucherMutation = useMutation({
    mutationFn: voucherApi.updateVoucher,
    onSuccess: () => {
      toast.success("Update voucher thành công");
      onClose();
      onSuccessAddVoucher();
    },
  });
  const handleSubmitForm = (values: FormData) => {
    if (selectVoucher) {
      updateVoucherMutation.mutate({
        id: selectVoucher,
        body: values,
      });
    } else {
      addVoucherMutation.mutate(values);
    }
  };

  return (
    <ModalPortal>
      <div className="w-[600px]  bg-white p-7 rounded-sm shadow-md  modal-content">
        <div className="text-xl mb-4">Voucher</div>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="relative">
          <div className="flex mb-1">
            <span className="w-48 pt-2 pr-4 shrink-0">
              Tên chương trình giảm giá
            </span>
            <div className="grow ">
              <InputField control={control} name="voucher_name" />
            </div>
          </div>
          <div className="flex mb-3">
            <span className="w-48 pt-2 pr-4 shrink-0">Mã voucher</span>
            <div className="grow ">
              <InputField control={control} name="voucher_code" />
            </div>
          </div>
          <div className="flex mb-1">
            <span className="w-48 pr-4 pt-2 shrink-0">
              Thời gian sử dụng mã
            </span>
            <div className="grow">
              <div className="flex gap-x-2">
                <InputDateField
                  control={control}
                  name="voucher_start_date"
                  placeholder="Ngày bắt đầu"
                  onTrigger={() => trigger("voucher_end_date")}
                />
                <InputDateField
                  control={control}
                  name="voucher_end_date"
                  placeholder="Ngày kết thúc"
                  onTrigger={() => trigger("voucher_start_date")}
                />
              </div>
              <div className={`text-xs sm:text-sm text-red1 min-h-[20px]`}>
                {(errors["voucher_start_date"] &&
                  errors["voucher_start_date"].message) ||
                  (errors["voucher_end_date"] &&
                    errors["voucher_end_date"].message)}
              </div>
            </div>
          </div>
          <div className="flex mb-1">
            <span className="w-48 pr-4 pt-2 shrink-0">Mức giảm</span>
            <div className="grow flex gap-x-2">
              <InputNumberField
                hideError={true}
                control={control}
                name="voucher_value"
                classNameParent="w-full mb-5"
                className="px-3 py-2"
              />
            </div>
          </div>
          <div className="flex mb-3">
            <span className="w-48 pr-4 pt-2 shrink-0">Đơn hàng tối thiểu</span>
            <div className="grow flex gap-x-2">
              <InputNumberField
                hideError={true}
                control={control}
                name="voucher_min_order_value"
                classNameParent="w-full mb-5"
                className="px-3 py-2"
              />
            </div>
          </div>
          <div className="flex mb-1">
            <span className="w-48 pr-4 pt-2 shrink-0">Sử dụng tối đa</span>
            <div className="grow flex gap-x-2">
              <InputNumberField
                hideError={true}
                control={control}
                name="voucher_max_uses"
                classNameParent="w-full mb-5"
                className="px-3 py-2"
              />
            </div>
          </div>
          <div className="flex mb-1">
            <span className="w-48 pr-4 pt-2 shrink-0">
              Lượt sử dụng tối đa/Người mua
            </span>
            <div className="grow flex gap-x-2">
              <InputNumberField
                hideError={true}
                control={control}
                name="voucher_max_uses_per_user"
                classNameParent="w-full mb-5"
                className="px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-5 text-right sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-orange border border-gray3 rounded-sm h-10 w-20"
            >
              Đóng
            </button>
            <Button
              isLoading={isSubmitting}
              type="submit"
              className="text-white bg-orange mx-3 rounded-sm w-[150px] h-10"
              label={selectVoucher ? "Cập nhập" : "Thêm voucher"}
            />
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}
