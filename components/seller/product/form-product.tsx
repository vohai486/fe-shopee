import { categoryApi, productApi } from "@/api-client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { InputField, InputFile, InputNumberField } from "../../form";
import { QuillField } from "../../form/quill-editor";
import { SelectField } from "../../form/select-field";
import { Button } from "../../common/button";
import { ModalPortal } from "@/components/common";
export interface FormProductProps {
  onClose: () => void;
}

type FormData = {
  product_name: string;
  product_description: string;
  product_originalPrice: number;
  product_importPrice: number;
  product_discount: number;
  product_quantity: number;
  product_category: string;
  product_brand: string;
  product_specifications?: { key: string; value: string }[];
  product_size?: Object;
  image: File | string;
};

const schema = yup.object().shape({
  product_name: yup.string().required("Vui lòng nhập tên sản phẩm"),
  product_description: yup
    .string()
    .required("Vui lòng nhập mô tả")
    .min(
      100,
      "Mô tả sản phẩm của bạn quá ngắn. Vui lòng nhập ít nhất 100 kí tự"
    ),
  product_originalPrice: yup
    .number()
    .min(0, "lớn hơn 0")
    .required("Vui lòng nhập giá bán"),
  product_importPrice: yup
    .number()
    .min(0, "lớn hơn 0")
    .required("Vui lòng nhập giá nhập"),
  product_discount: yup
    .number()
    .min(0, "lớn hơn 0")
    .required("Vui lòng nhập giảm giá"),
  product_quantity: yup
    .number()
    .min(0, "lớn hơn 0")
    .required("Vui lòng số lượng nhập"),
  product_category: yup.string().required("Chọn danh mục sản phẩm"),
  product_brand: yup.string().required("Vui lòng nhập tên sản phẩm"),
  image: yup.mixed().test("isImageOrUrl", "Thêm hình ảnh", function (value) {
    if (!value) return false;
    if (typeof value === "string" && value.startsWith("http")) return true;
    return value instanceof File && value.type.startsWith("image/");
  }),
});
export function FormProduct({ onClose }: FormProductProps) {
  const queryClient = useQueryClient();
  const { pathname, query } = useRouter();

  const [file, setFile] = useState<File>();
  const {
    control,
    handleSubmit,
    setError,
    register,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues: {
      product_name: "",
      product_description: "",
      product_category: "",
      product_brand: "",
      image: "",
    },
    shouldFocusError: false,
    resolver: yupResolver(schema as any),
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "product_specifications",
  });
  const { data } = useQuery({
    queryKey: ["category-shop"],
    queryFn: categoryApi.getAll,
    staleTime: 60 * 60 * 1000,
  });
  const listCategory =
    data &&
    data.metadata.map((cate) => ({
      label: cate.category_name,
      value: cate._id,
    }));
  const mutationCreate = useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      toast.success("Thêm sản phẩm thành công");
      queryClient.invalidateQueries(["product-shop", query]);
      onClose();
    },
  });
  const handleSubmitForm = async (values: FormData) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "product_specifications") {
        // @ts-ignore
        formData.append(key, JSON.stringify(values[key]));
      } else {
        // @ts-ignore
        formData.append(key, values[key]);
      }
    });
    await mutationCreate.mutateAsync(formData);
  };
  const filePreview = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file]
  );
  const handleChangeFile = (file: File) => {
    setFile(file);
  };
  return (
    <ModalPortal>
      <div className="w-[900px]  bg-white p-7 rounded-sm shadow-md  modal-content">
        <div className="text-xl mb-4">Sản phẩm</div>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="relative">
          <div className="grid grid-cols-4 gap-x-4 max-h-[500px] hidden-scroll overflow-auto  gap-y-6">
            <div className="col-span-1 text-right">
              <span className="text-orange text-xs">*</span> Hình ảnh sản phẩm
            </div>
            <div className="col-span-3">
              <InputFile
                setError={setError}
                control={control}
                name="image"
                handleChangeFile={handleChangeFile}
                position="text-left"
              >
                <div className="w-20 h-20 border border-gray4 border-dashed flex justify-center items-center">
                  {!filePreview ? (
                    <div className="flex flex-col items-center text-orange cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        className="w-6 h-6 stroke-current"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                      Thêm Hình
                    </div>
                  ) : (
                    <Image
                      width={80}
                      height={80}
                      src={filePreview || ""}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    ></Image>
                  )}
                </div>
              </InputFile>
            </div>
            <div className="col-span-1 text-right">
              <span className="text-orange text-xs">*</span> Tên sản phẩm
            </div>
            <div className="col-span-3">
              <InputField control={control} name="product_name" />
            </div>
            <div className="col-span-1 text-right">
              <span className="text-orange text-xs">*</span> Chọn ngành hàng
            </div>
            <div className="col-span-3">
              <SelectField
                array={listCategory || []}
                control={control}
                name="product_category"
                label="Chọn danh mục"
              />
            </div>
            <div className="col-span-1 text-right">
              <span className="text-orange text-xs">*</span> Mô tả sản phẩm
            </div>
            <div className="col-span-3">
              <QuillField control={control} name="product_description" />
            </div>
            <div className="col-span-1 text-right">
              <span className="text-orange text-xs">*</span> Nhãn hàng
            </div>
            <div className="col-span-3">
              <InputField name="product_brand" control={control} />
            </div>
            <div className="col-span-1 text-right">
              <span className="text-orange text-xs">*</span> Số lượng nhập
            </div>
            <div className="col-span-1 text-right">
              <InputNumberField
                placeholder="Số lượng nhập"
                control={control}
                name="product_quantity"
              />
            </div>
            <div className="col-span-1 text-right">
              <span className="text-orange text-xs">*</span> Giá nhập
            </div>
            <div className="col-span-1 text-right">
              <InputNumberField
                placeholder="Giá nhập"
                control={control}
                name="product_importPrice"
              />
            </div>
            <div className="col-span-1 text-right">
              <span className="text-orange text-xs">*</span> Giá bán
            </div>
            <div className="col-span-1 text-right">
              <InputNumberField
                placeholder="Giá bán"
                control={control}
                name="product_originalPrice"
              />
            </div>
            <div className="col-span-1 text-right">
              <span className="text-orange text-xs">*</span> Giảm giá
            </div>
            <div className="col-span-1 text-right">
              <InputNumberField
                placeholder="Giá bán"
                control={control}
                name="product_discount"
              />
            </div>
            <div className="col-span-1 text-right">
              <span className="text-orange text-xs">*</span> Thông tin chi tiết
              <div
                onClick={() => append({ key: "", value: "" })}
                className="ml-auto mt-5 cursor-pointer flex h-10 w-10 justify-center border border-gray3 items-center rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  className="w-5 h-5 stroke-orange"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
            </div>
            <div className="col-span-3 flex flex-col gap-y-2 ">
              {fields.map((item, index) => (
                <div className="flex gap-x-5" key={item.id}>
                  <input
                    type="text"
                    // value={item.key}
                    defaultValue={item.key}
                    {...register(`product_specifications.${index}.key`)}
                    className="py-2 px-3 w-full rounded-md   h-full outline-none border border-gray3 focus:border-orange"
                  />
                  <input
                    type="text"
                    defaultValue={item.value}
                    {...register(`product_specifications.${index}.value`)}
                    className="py-2 px-3 rounded-md w-full   h-full outline-none border border-gray3 focus:border-orange"
                  />
                  <div
                    onClick={() => remove(index)}
                    className="shrink-0 cursor-pointer flex h-10 w-10 justify-center border border-gray3 items-center rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      className="w-5 h-5 stroke-red1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              ))}
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
              label="Thêm sản phẩm"
            />
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}
