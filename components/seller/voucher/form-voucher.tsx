import { voucherApi } from "@/api-client";
import { Form } from "@/components/common";
import { PayloadAddVoucher, Voucher } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAfter, isValid } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Button } from "../../common/button";
import { InputDateField, InputField, InputNumberField } from "../../form";
import { useRouter } from "next/router";
interface FormProductProps {
  onCloseModal?: () => void;
  voucher?: Voucher;
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
export function FormVoucher({ onCloseModal, voucher }: FormProductProps) {
  const { query } = useRouter();
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    shouldFocusError: false,
    defaultValues: {
      voucher_code: "",
      voucher_name: "",
      voucher_start_date: new Date(),
      voucher_end_date: new Date(),
      voucher_min_order_value: 0,
      voucher_max_uses: 0,
      voucher_max_uses_per_user: 0,
      voucher_value: 0,
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    console.log(voucher?.voucher_value);
    if (voucher?._id) {
      setValue("voucher_code", voucher.voucher_code);
      setValue("voucher_name", voucher.voucher_name);
      setValue("voucher_end_date", new Date(voucher.voucher_end_date));
      setValue("voucher_start_date", new Date(voucher.voucher_start_date));
      setValue("voucher_max_uses", +voucher.voucher_max_uses);
      setValue("voucher_max_uses_per_user", +voucher.voucher_max_uses_per_user);
      setValue("voucher_min_order_value", +voucher.voucher_min_order_value);
      setValue("voucher_value", +voucher.voucher_value);
    }
  }, [setValue, voucher]);

  const addVoucherMutation = useMutation({
    mutationFn: voucherApi.addVoucher,
    onSuccess: () => {
      toast.success("Thêm voucher thành công");
      onCloseModal?.();
      queryClient.invalidateQueries(["voucher", query]);
    },
  });
  const updateVoucherMutation = useMutation({
    mutationFn: voucherApi.updateVoucher,
    onSuccess: () => {
      toast.success("Update voucher thành công");
      onCloseModal?.();
      queryClient.invalidateQueries(["voucher", query]);
    },
  });
  const handleSubmitForm = (values: FormData) => {
    if (voucher) {
      updateVoucherMutation.mutate({
        id: voucher._id,
        body: values,
      });
    } else {
      addVoucherMutation.mutate(values);
    }
  };

  return (
    <div className="px-6">
      <div className="text-xl text-title font-bold mb-4">
        {voucher?._id ? "Cập nhập" : "Thêm Voucher"}
      </div>
      <div className="overflow-y-auto hidden-scroll">
        <Form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="w-[800px] pt-3"
        >
          <Form.Row
            label="Tên chương trình giảm giá"
            error={errors["voucher_name"]?.message || ""}
            position="items-start"
          >
            <InputField
              control={control}
              name="voucher_name"
              showError={false}
            />
          </Form.Row>
          <Form.Row
            label="Mã voucher"
            error={errors["voucher_code"]?.message || ""}
            position="items-start"
          >
            <InputField
              control={control}
              name="voucher_code"
              showError={false}
            />
          </Form.Row>
          <Form.Row
            label="Thời gian sử dụng mã"
            error={
              (errors["voucher_start_date"] &&
                errors["voucher_start_date"].message) ||
              (errors["voucher_end_date"] &&
                errors["voucher_end_date"].message) ||
              ""
            }
            position="items-start"
          >
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
          </Form.Row>
          <Form.Row
            label="Mức giảm"
            error={errors["voucher_value"]?.message || ""}
            position="items-start"
          >
            <InputNumberField
              hideError={true}
              control={control}
              name="voucher_value"
              className="px-3 py-2 text-sm"
            />
          </Form.Row>
          <Form.Row
            label="Đơn hàng tối thiểu"
            error={errors["voucher_min_order_value"]?.message || ""}
            position="items-start"
          >
            <InputNumberField
              hideError={true}
              control={control}
              name="voucher_min_order_value"
              className="px-3 py-2 text-sm"
            />
          </Form.Row>
          <Form.Row
            label="Sử dụng tối đa"
            error={errors["voucher_max_uses"]?.message || ""}
            position="items-start"
          >
            <InputNumberField
              hideError={true}
              control={control}
              name="voucher_max_uses"
              className="px-3 py-2 text-sm"
            />
          </Form.Row>
          <Form.Row
            label="Lượt sử dụng tối đa/Người mua"
            error={errors["voucher_max_uses_per_user"]?.message || ""}
            position="items-start"
          >
            <InputNumberField
              hideError={true}
              control={control}
              name="voucher_max_uses_per_user"
              className="px-3 py-2 text-sm"
            />
          </Form.Row>
          <div className="flex pt-4 justify-end gap-2">
            <Button
              type="reset"
              label="Trở lại"
              onClick={() => {
                reset();
                onCloseModal?.();
              }}
              className="px-3  h-10 border rounded-md border-box text-title"
            ></Button>
            <Button
              isLoading={
                addVoucherMutation.isLoading || updateVoucherMutation.isLoading
              }
              label={!voucher?._id ? "Thêm Voucher" : "Cập nhập"}
              type="submit"
              className="px-3 text-grey-0 rounded-md bg-blue-200 h-10 "
            ></Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
