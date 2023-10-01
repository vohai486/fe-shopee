import { categoryApi, productApi } from "@/api-client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import {
  InputField,
  InputFile,
  InputNumberField,
  PhotoField,
} from "../../form";
import { QuillField } from "../../form/quill-editor";
import { SelectField } from "../../form/select-field";
import { Button } from "../../common/button";
import { Form, ModalPortal } from "@/components/common";
import { Product } from "@/types";
export interface FormProductProps {
  onCloseModal?: () => void;
  product?: Product;
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
  product_specifications: { key: string; value: string }[];
  product_size: Object;
  image: File | string;
  thumbnail: null | {
    file: File | null;
    previewUrl: string;
  };
};

export function FormProduct({ onCloseModal, product }: FormProductProps) {
  const queryClient = useQueryClient();
  const { pathname, query } = useRouter();
  const schema = yup.object().shape({
    product_name: yup.string().required("Vui lòng nhập tên sản phẩm"),
    product_description: yup.string().required("Vui lòng nhập mô tả"),
    product_originalPrice: yup
      .number()
      .min(1, "Phải lớn hơn 0")
      .required("Vui lòng nhập giá bán"),
    // product_importPrice: yup
    //   .number()
    //   .min(1, "Phải lớn hơn 0")
    //   .required("Vui lòng nhập giá nhập"),
    product_discount: yup
      .number()
      .min(1, "Phải lớn hơn 0")
      .required("Vui lòng nhập giảm giá"),
    // product_quantity: yup
    //   .number()
    //   .min(1, "Phải lớn hơn 0")
    //   .required("Vui lòng số lượng nhập"),
    product_category: yup.string().required("Chọn danh mục sản phẩm"),
    product_brand: yup.string().required("Vui lòng nhập tên sản phẩm"),
    thumbnail: yup
      .object()
      .nullable()
      .test(
        "test-required",
        "Vui lòng chọn hình ảnh",
        (value: null | yup.AnyObject) => {
          // required when add
          if (Boolean(product?._id) || value?.file) return true;
          // optional when edit
          return false;
          // return context.createError({
          //   message: "Vui lòng chọn hình ảnh",
          // });
        }
      )
      .test("test-size", "Không quá 1MB", (value: null | yup.AnyObject) => {
        const fileSize = value?.file?.["size"] || 0;
        const MAX_SIZE = 1 * 1024 * 1024; //1MB
        // limit size
        return fileSize < MAX_SIZE;
      }),
  });
  const {
    control,
    handleSubmit,
    setError,
    register,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<Partial<FormData>>({
    defaultValues: {
      product_name: "",
      product_description: "",
      product_brand: "",
      product_importPrice: 0,
      product_originalPrice: 0,
      product_discount: 0,
      product_quantity: 0,
      thumbnail: null,
      product_category: product?.product_category?._id || "",
    },
    shouldFocusError: false,
    resolver: yupResolver(schema as any),
    mode: "onChange",
  });
  const { fields, replace, append, remove } = useFieldArray({
    control,
    name: "product_specifications",
  });
  useEffect(() => {
    if (!product?._id) return;
    setValue("product_name", product.product_name);
    setValue("product_description", product.product_description);
    setValue("product_category", product.product_category._id);
    setValue("product_brand", product.product_brand);
    setValue("product_name", product.product_name);
    setValue("product_discount", product.product_discount);
    setValue("product_originalPrice", product.product_originalPrice);
    setValue(
      "thumbnail",
      product?._id ? { file: null, previewUrl: product?.product_thumb } : null
    );
    replace(product.product_specifications || []);
  }, [product, setValue, replace]);

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
      onCloseModal?.();
    },
  });
  const mutationUpdate = useMutation({
    mutationFn: productApi.updateProduct,
    onSuccess: () => {
      toast.success("Sửa sản phẩm thành công");
      queryClient.invalidateQueries(["product-shop", query]);
      onCloseModal?.();
    },
  });

  const handleSubmitForm = async (values: Partial<FormData>) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "product_specifications") {
        formData.set(key, JSON.stringify(values[key]));
      } else if (key === "thumbnail") {
        if (values.thumbnail?.file) {
          formData.set("image", values.thumbnail?.file);
        }
      } else if (key === "product_category") {
        if (product?.product_category._id !== values["product_category"]) {
          formData.set(
            "product_category",
            values["product_category"] as string
          );
        }
      } else {
        // @ts-ignore
        if (product?.[key] !== values[key]) {
          // @ts-ignore
          formData.set(key, values[key] as string);
        }
      }
    });

    if (Boolean(product?._id)) {
      await mutationUpdate.mutateAsync({
        data: formData,
        id: product?._id as string,
      });
    } else {
      await mutationCreate.mutateAsync(formData);
    }
  };

  return (
    <div className="h-full px-6">
      <div className="text-xl mb-4">Sản phẩm</div>
      <div className="overflow-y-auto hidden-scroll">
        <Form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="w-[800px] h-[500px]"
        >
          <Form.Row
            label="Hình ảnh sản phẩm"
            error={errors["image"]?.message || ""}
          >
            <PhotoField control={control} name="thumbnail" />
          </Form.Row>
          <Form.Row
            label="Tên sản phẩm"
            error={errors["product_name"]?.message || ""}
          >
            <InputField
              showError={false}
              control={control}
              name="product_name"
            />
          </Form.Row>
          <Form.Row
            label="Chọn ngành hàng"
            error={errors["product_category"]?.message || ""}
          >
            <SelectField
              array={listCategory || []}
              control={control}
              name="product_category"
              showError={false}
            />
          </Form.Row>
          <Form.Row
            label="Mô tả sản phẩm"
            error={errors["product_description"]?.message || ""}
          >
            <QuillField
              showError={false}
              control={control}
              name="product_description"
            />
          </Form.Row>
          <Form.Row
            label="Nhãn hàng"
            error={errors["product_brand"]?.message || ""}
          >
            <InputField
              showError={false}
              name="product_brand"
              control={control}
            />
          </Form.Row>
          {!product && (
            <>
              {" "}
              <Form.Row
                label="Số lượng nhập"
                error={errors["product_quantity"]?.message || ""}
              >
                <InputNumberField
                  hideError={true}
                  control={control}
                  name="product_quantity"
                  className="w-[50px] py-2 px-3 text-sm"
                />
              </Form.Row>
              <Form.Row
                label="Giá nhập"
                error={errors["product_importPrice"]?.message || ""}
              >
                <InputNumberField
                  hideError={true}
                  control={control}
                  name="product_importPrice"
                  className="w-[50px] py-2 px-3 text-sm"
                />
              </Form.Row>
            </>
          )}

          <Form.Row
            label="Giá bán"
            error={errors["product_originalPrice"]?.message || ""}
          >
            <InputNumberField
              hideError={true}
              control={control}
              name="product_originalPrice"
              className="w-[50px] py-2 px-3 text-sm"
            />
          </Form.Row>
          <Form.Row
            label="Giảm giá"
            error={errors["product_discount"]?.message || ""}
          >
            <InputNumberField
              hideError={true}
              control={control}
              name="product_discount"
              className="w-[50px] py-2 px-3 text-sm"
            />
          </Form.Row>
          <Form.Row
            label={
              <div className="flex gap-2 items-center">
                <span>Thông tin chi tiết</span>
                <button
                  onClick={() => append({ key: "", value: "" })}
                  className="w-6 h-6 border border-blue-200 rounded-full flex justify-center items-center"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    className="w-5 h-5 stroke-blue-200"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              </div>
            }
            columns="1fr 2fr 1fr"
            error={""}
            hiddenError={false}
            position="items-start"
          >
            <div className="flex col-span-2 flex-col gap-y-2">
              {fields.map((item, index) => (
                <div className="flex gap-x-5 " key={item.id}>
                  <input
                    // value={item.key}
                    defaultValue={item.key}
                    {...register(`product_specifications.${index}.key`)}
                    className="py-2 px-3 w-full rounded-md"
                  />
                  <input
                    // value={item.value}
                    defaultValue={item.value}
                    {...register(`product_specifications.${index}.value`)}
                    className="py-2 px-3 w-full rounded-md"
                  />
                  <div
                    onClick={() => remove(index)}
                    className="shrink-0 cursor-pointer flex items-center h-10 w-10 justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      className="w-5 h-5 stroke-red-100"
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
          </Form.Row>
          <div className="flex pt-4 justify-end gap-2">
            <Button
              label="Trở về"
              type="reset"
              onClick={() => onCloseModal?.()}
              className="px-3  h-10 border rounded-md border-box text-title"
            />
            <Button
              type="submit"
              label={product ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              className="px-3 text-grey-0 rounded-md bg-blue-200 h-10 "
              isLoading={mutationCreate.isLoading}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
