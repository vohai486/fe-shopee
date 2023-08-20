import { shopApi } from "@/api-client";
import { InputField } from "@/components/form";
import { SellerPortalLayout } from "@/components/layouts";
import { FormAddressSeller } from "@/components/seller";
import { useAuth } from "@/hooks";
import { Address } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
type FormData = {
  name: string;
  email: string;
  phoneNumberUser?: string;
  address: Omit<Address, "_id" | "type" | "default">;
};

export default function FormPortalPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const { profile } = useAuth();
  const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập Tên Shop"),
    address: yup
      .object({
        fullName: yup.string().required(),
        phoneNumber: yup.string().required(),
        city: yup.string().required(),
        district: yup.string().required(),
        ward: yup.string().required(),
        street: yup.string().required(),
        codeCity: yup.number().required(),
        codeDistrict: yup.number().required(),
      })
      .required("Vui lòng chọn địa chỉ nhận hàng"),
  });
  const registerMutation = useMutation({
    mutationFn: shopApi.registerSeller,
    onSuccess: () => {
      toast.success("Đăng kí thành công");
      queryClient.invalidateQueries(["shop", profile?._id]);
    },
  });
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues: {
      phoneNumberUser: "",
      name: "",
      address: {
        fullName: "",
        phoneNumber: "",
        city: "",
        district: "",
        ward: "",
        street: "",
        codeCity: 0,
        codeDistrict: 0,
      },
      email: "",
    },
    resolver: yupResolver(schema as any),
    mode: "onChange",
  });
  useEffect(() => {
    if (profile) {
      setValue("phoneNumberUser", profile?.phoneNumber);
      setValue("email", profile?.email);
    }
  }, [profile, setValue]);
  const handleSubmitForm = (values: FormData) => {
    delete values["phoneNumberUser"];
    registerMutation.mutate(values);
  };
  const onSetValue = (value: Omit<Address, "_id" | "type" | "default">) => {
    setValue("address", value);
  };
  return (
    <div className="bg-white p-14 text-sm shadow-2xl rounded-lg flex items-center justify-center">
      {showModal && (
        <FormAddressSeller
          onSetValue={onSetValue}
          onClose={() => setShowModal(false)}
        />
      )}
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="w-[600px] py-8 grid grid-cols-3 gap-x-4 border-t border-b border-gray3 gap-y-3"
      >
        <div className="col-span-1 text-right">
          <span className="text-orange text-xs mr-1 ">*</span>
          Tên Shop
        </div>
        <div className="col-span-2">
          <InputField name="name" control={control} placeholder="Tên Shop" />
        </div>
        <div className="col-span-1 text-right">
          <span className="text-orange text-xs mr-1 ">*</span>
          Địa chỉ lấy hàng
        </div>
        <div className="col-span-2">
          <button
            type="button"
            className="border border-gray1 py-2 px-3 rounded-sm"
            onClick={() => setShowModal(true)}
          >
            + Thêm
          </button>
          <div className="h-5 text-sm text-red1">
            {errors["address"] && errors["address"].message}
          </div>
        </div>
        <div className="col-span-1 text-right">
          <span className="text-orange text-xs mr-1 ">*</span>
          Email
        </div>
        <div className="col-span-2">
          <InputField name="email" control={control} disabled={true} />
        </div>
        <div className="col-span-1 text-right">
          <span className="text-orange text-xs mr-1 ">*</span>
          Số điện thoại
        </div>
        <div className="col-span-2">
          <InputField
            name="phoneNumberUser"
            control={control}
            disabled={true}
          />
          <div className="text-gray4 mt-2">
            Đổi số điện thoại tại{" "}
            <Link className="text-blue" href="/user/profile">
              Hồ sơ của tôi
            </Link>
          </div>
        </div>
        <div className="col-span-3 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-sm bg-orange text-white"
          >
            Đăng ký
          </button>
        </div>
      </form>
    </div>
  );
}
FormPortalPage.Layout = SellerPortalLayout;
