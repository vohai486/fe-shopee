import { userApi } from "@/api-client";
import { DateField, InputField, RadioField } from "@/components/form";
import { InputFile } from "@/components/form/input-file";
import { UserProfileLayout } from "@/components/layouts";
import { User } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

type FormData = Pick<
  User,
  "date_of_birth" | "email" | "fullName" | "gender" | "phoneNumber"
> & { image?: File };
const arrayOptions = [
  {
    label: "Nam",
    value: 1,
  },
  {
    label: "Nữ",
    value: 2,
  },
  {
    label: "Khác",
    value: 3,
  },
];
export default function ProfilePage() {
  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Không được bỏ trống")
      .email("Email không hợp lệ"),
    fullName: yup.string().required("Không được bỏ trống"),
    date_of_birth: yup.date().max(new Date(), "Ngày không hợp lệ"),
  });
  const [file, setFile] = useState<File>();
  const { data, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      return userApi.getProfile();
    },
    keepPreviousData: true,
    staleTime: 60 * 60 * 1000,
  });
  const updateUserMutation = useMutation({
    mutationFn: userApi.updateMe,
  });
  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar,
  });

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      date_of_birth: new Date("1-1-1990"),
      fullName: "",
      gender: 0,
      phoneNumber: "",
      image: undefined,
    },
    resolver: yupResolver(schema as any),
    mode: "onChange",
  });

  const filePreview = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file]
  );

  useEffect(() => {
    const profile = data?.metadata;
    if (profile) {
      setValue("phoneNumber", profile.phoneNumber);
      setValue("email", profile.email);
      setValue("gender", profile.gender);
      setValue("date_of_birth", profile.date_of_birth);
      setValue("fullName", profile.fullName);
    }
  }, [data, setValue]);
  const handleUpdateUser = async (values: FormData) => {
    try {
      if (values.image) {
        const form = new FormData();
        form.append("image", values.image);
        await uploadAvatarMutation.mutateAsync(form);
      }
      await updateUserMutation.mutateAsync(values);
      refetch();
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleChangeFile = (file: File) => {
    setFile(file);
  };
  return (
    <div className="md:p-8 p-4 text-sm  border border-box bg-box shadow-sm-50 rounded-md">
      <h1 className=" pb-4 text-center lg:text-left border-b border-box text-lg font-medium text-title">
        Hồ Sơ Của Tôi
      </h1>
      <form
        onSubmit={handleSubmit(handleUpdateUser)}
        className="lg:pt-7 pt-4 flex flex-col lg:flex-row items-start "
      >
        <div className="grow w-full order-2 lg:order-1 grid grid-cols-4 gap-y-7 gap-x-2 md:gap-x-5">
          <div className="col-span-1 text-right  pt-2">Họ Tên</div>
          <div className="col-span-3">
            <InputField
              classParent="w-full sm:w-4/5"
              classTextError="text-sm text-red1"
              control={control}
              name="fullName"
            />
          </div>
          <div className="col-span-1 text-right pt-2">Email</div>
          <div className="col-span-3">
            <InputField
              classParent="w-full sm:w-4/5"
              classTextError="text-sm text-red1"
              control={control}
              name="email"
              disabled={true}
            />
          </div>
          <div className="col-span-1 text-right  my-auto">Số điện thoại</div>
          <div className="col-span-3">
            <InputField
              classParent="w-full sm:w-4/5"
              classTextError="text-sm text-red1"
              control={control}
              name="phoneNumber"
            />
          </div>
          <div className="col-span-1 text-right  my-auto">Giới tính</div>
          <div className="col-span-3">
            <RadioField
              arrayOptions={arrayOptions}
              control={control}
              name="gender"
            />
          </div>
          <div className="col-span-1 text-right  sm:my-auto">Ngày sinh</div>
          <div className="col-span-3">
            <DateField control={control} name="date_of_birth" />
          </div>
          <div className="col-span-1"></div>
          <div className="col-span-3">
            <button className=" bg-blue-200 rounded-md text-grey-0 h-10 w-20 ">
              Lưu
            </button>
          </div>
        </div>
        <div className="lg:w-72 w-full order-1 lg:order-2 lg:border-l border-box flex justify-center">
          <div className="flex flex-col items-center">
            <div className="w-[100px] my-5 h-[100px] overflow-hidden flex items-center justify-center rounded-full border border-box bg-box">
              {filePreview || data?.metadata.avatar ? (
                <Image
                  width={100}
                  height={100}
                  src={filePreview || data?.metadata.avatar || ""}
                  alt=""
                  style={{
                    width: "100%",
                  }}
                ></Image>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  className="w-12 h-12 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              )}
            </div>
            <InputFile
              setError={setError}
              control={control}
              name="image"
              handleChangeFile={handleChangeFile}
            >
              <button
                type="button"
                className="border text-title border-box shadow-md h-10 w-28 rounded-md "
              >
                Chọn Ảnh
              </button>
            </InputFile>
          </div>
        </div>
      </form>
    </div>
  );
}

ProfilePage.Layout = UserProfileLayout;
