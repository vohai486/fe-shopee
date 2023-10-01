import { Address } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { InputField } from "../../form";
import { AddressField } from "../../form/address-field";
import { TextareaField } from "../../form/textarea-field";
import { ModalPortal } from "@/components/common";

type FormData = Omit<Address, "_id" | "type" | "default">;

interface FormAddressProps {
  onClose: () => void;
  onSetValue: (value: FormData) => void;
}
const schema = yup.object().shape({
  fullName: yup.string().required("Vui lòng nhập Họ và tên"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
  city: yup.string().required(),
  district: yup.string().required(),
  ward: yup.string().required(),
  street: yup.string().required("Vui lòng nhập địa chỉ cụ thể"),
  codeCity: yup.number().min(0).required(),
  codeDistrict: yup.number().min(0).required(),
  codeWard: yup.number().min(0).required(),
});
export function FormAddressSeller({ onClose, onSetValue }: FormAddressProps) {
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      city: "",
      district: "",
      ward: "",
      street: "",
      codeCity: 0,
      codeDistrict: 0,
      codeWard: 0,
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const handleSubmitForm = async (values: FormData) => {
    onSetValue(values);
    onClose();
  };
  const setValueForm = (name: string, value: number | string) => {
    setValue(name as keyof FormData, value);
  };
  const getValueForm = (name: string) => {
    return getValues(name as keyof FormData);
  };
  return (
    <ModalPortal>
      <div className="w-[500px] bg-box border border-box p-7 rounded-sm shadow-md  modal-content">
        <div className="text-xl mb-4">Địa chỉ gửi hàng</div>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="flex gap-x-2 mb-6">
            <InputField
              control={control}
              classParent="w-full"
              classTextError="h-[unset] text-red"
              name="fullName"
              placeholder="Họ và tên"
            />
            <InputField
              control={control}
              classParent="w-full"
              classTextError="h-[unset] text-red"
              name="phoneNumber"
              placeholder="Số điện thoại"
            />
          </div>
          <div className="mb-6">
            <AddressField
              setValueForm={setValueForm}
              getValueForm={getValueForm}
              error={
                !!errors["city"] ||
                !!errors["district"] ||
                !!errors["ward"] ||
                !!errors["codeCity"] ||
                !!errors["codeWard"] ||
                !!errors["codeDistrict"]
              }
              city=""
              district=""
              ward=""
            />
          </div>
          <div className="mb-6">
            <TextareaField
              placeholder="Địa chỉ cụ thể"
              control={control}
              name="street"
              classTextError="h-[unset] text-red"
            />
          </div>
          <div className="py-5 flex justify-end gap-x-3">
            <button
              onClick={onClose}
              type="button"
              className="py-2 text-gray2 w-28 hover:bg-gray1"
            >
              Trở Lại
            </button>
            <button type="submit" className="py-2 w-28 bg-orange text-white">
              Hoàn thành
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}
