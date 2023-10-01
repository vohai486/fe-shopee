import { reviewApi } from "@/api-client";
import { Button, ModalPortal } from "@/components/common";
import { RatingField, TextareaField } from "@/components/form";
import { ListPhotoField } from "@/components/form/list-photo-field";
import { Order } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

interface Image {
  file: File;
  previewUrl: string;
}

interface Review {
  content: string;
  rating: number;
  images?: Image[];
  idProduct?: string;
}

const schema = yup.object().shape({
  reviews: yup.array().of(
    yup.object().shape({
      content: yup.string().required("Vui lòng nhập đánh giá"),
      rating: yup
        .number()
        .min(1, "Vui lòng chọn số sao")
        .max(5, "Vui lòng chọn số sao"),
      images: yup
        .array()
        .nullable()
        .of(
          yup.object().shape({
            file: yup
              .mixed()
              .required("Image file is required")
              .test("file-size", "Hình ảnh không được quá 1MB", (value) => {
                return value instanceof File && value.size <= 1024 * 1024; // 1MB = 1024 * 1024 bytes
              }),
            previewUrl: yup.string().required("Image preview URL is required"),
          })
        )
        .test(
          "maxItems",
          "Số lượng hình ảnh upload không vượt quá 5",
          (value) => {
            // Kiểm tra nếu mảng có ít hơn hoặc bằng 5 phần tử
            return value instanceof Array && value.length <= 5;
          }
        ),
    })
  ),
});
export function ModelReview({
  onCloseModal,
  order,
}: {
  onCloseModal?: () => void;
  order: Order;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ reviews: Review[]; ratingShop: number }>({
    shouldFocusError: false,
    defaultValues: {
      ratingShop: 0,
    },
    resolver: yupResolver(schema as any),
    mode: "onChange",
  });
  const { fields, append, replace, insert, remove } = useFieldArray({
    control: control,
    name: "reviews",
  });
  useEffect(() => {
    const products: Review[] = [];
    order.order_products.forEach((product) => {
      products.push({
        content: "",
        rating: 0,
        images: [],
        idProduct: product.product._id,
      });
    });
    replace(products);
  }, [replace, order]);
  const mutationCreateReview = useMutation({
    mutationFn: reviewApi.create,
    onSuccess: () => {
      toast.success("Thêm đánh giá thành công");
      onCloseModal?.();
    },
  });
  const handleSubmitForm = async ({ reviews }: { reviews: Review[] }) => {
    const result: FormData[] = [];
    reviews.forEach((review) => {
      const data = new FormData();
      // @ts-ignore
      data.append("rating", review.rating);
      // @ts-ignore
      data.append("content", review.content);
      // @ts-ignore
      data.append("productId", review.idProduct);
      // @ts-ignore
      review.images.map((image: Image) => {
        data.append("images", image.file);
      });
      result.push(data);
    });
    if (result.length === 0) {
      return;
    }
    await Promise.all(
      [...result].map((item) => mutationCreateReview.mutateAsync(item))
    );
  };

  return (
    <div className="w400:w-[400px] w-[300px] max-h-[600px] overflow-auto hidden-scroll bg-box px-4 w400:px-6">
      <form onSubmit={handleSubmit(handleSubmitForm)} className="">
        {fields.map((item, idx) => {
          return (
            <div
              key={item.id}
              className={`[&:not(:last-child)]:border-b border-box [&:not(:first-child)]:pt-5 `}
            >
              <div className="mb-5">
                <RatingField name={`reviews.${idx}.rating`} control={control} />
              </div>
              <TextareaField
                name={`reviews.${idx}.content`}
                control={control}
                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này nhé"
              />
              <ListPhotoField
                errors={(errors.reviews && errors.reviews[idx]) || {}}
                control={control}
                name={`reviews.${idx}.images`}
              />
            </div>
          );
        })}
        <div className="flex gap-x-2 mt-5">
          <Button
            label="Trở về"
            type="reset"
            onClick={() => onCloseModal?.()}
            className="w-1/2  h-10 border rounded-md border-box text-title"
          />
          <Button
            type="submit"
            label="Gửi đánh giá"
            className="w-1/2 text-grey-0 rounded-md bg-blue-200 h-10 "
            isLoading={mutationCreateReview.isLoading}
          />
        </div>
      </form>
    </div>
  );
}
