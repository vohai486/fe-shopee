import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { CheckboxField, InputField, RadioField } from "../../form";
import { AddressField } from "../../form/address-field";
import { TextareaField } from "../../form/textarea-field";
import { Address } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/api-client";
import { ModalPortal } from "../../common/modal-portal";
export interface FormAddressProps {
  onClose: () => void;
  address: Address;
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
  type: yup.string().required("Vui lòng chọn"),
  codeCity: yup.number().min(0).required(),
  codeDistrict: yup.number().min(0).required(),
  codeWard: yup.number().min(0).required(),
});
type FormData = Omit<Address, "_id">;
export function FormAddressUser({ onClose, address }: FormAddressProps) {
  const queryClient = useQueryClient();

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
      type: "",
      default: false,
      codeCity: 0,
      codeDistrict: 0,
      codeWard: 0,
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!address?._id) return;
    setValue("city", address.city);
    setValue("district", address.district);
    setValue("ward", address.ward);
    setValue("default", address.default);
    setValue("codeCity", address.codeCity);
    setValue("codeDistrict", address.codeDistrict);
    setValue("fullName", address.fullName);
    setValue("phoneNumber", address.phoneNumber);
    setValue("street", address.street);
    setValue("type", address.type);
    setValue("codeWard", address.codeWard || 0);
  }, [address, setValue]);
  const addAddressMutation = useMutation({
    mutationFn: userApi.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(["address"]);
    },
  });
  const updateAddressMutation = useMutation({
    mutationFn: userApi.updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(["address"]);
    },
  });
  const handleSubmitForm = async (values: FormData) => {
    if (!address?._id) {
      await addAddressMutation.mutateAsync(values);
    } else {
      await updateAddressMutation.mutateAsync({
        id: address._id,
        data: values,
      });
    }
    onClose();
  };
  const setValueForm = (name: string, value: string | boolean | number) => {
    setValue(name as keyof FormData, value);
  };
  const getValueForm = (name: string) => {
    return getValues(name as keyof FormData);
  };
  return (
    <ModalPortal>
      <div className="sm:w-[500px] w-full bg-white p-3 sm:p-7 rounded-sm shadow-md  modal-content">
        <div className="text-xl font-medium mb-4">Địa chỉ mới</div>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="flex sm:flex-row flex-col gap-x-2 mb-6">
            <InputField
              control={control}
              classParent="w-full sm:mb-0 mb-6"
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
                !!errors["codeDistrict"] ||
                !!errors["codeWard"]
              }
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
          <div className="mb-6">
            <RadioField
              arrayOptions={[
                {
                  label: "Nhà Riêng",
                  value: "house",
                },
                {
                  label: "Văn Phòng",
                  value: "office",
                },
              ]}
              name="type"
              control={control}
            />
          </div>
          <div>
            <CheckboxField
              label="Đặt làm mặc định"
              name="default"
              control={control}
            />
          </div>
          <div className="py-3 sm:py-5 flex justify-end gap-x-3">
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
