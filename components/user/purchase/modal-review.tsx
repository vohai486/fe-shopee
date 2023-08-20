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
  onClose,
  selectOrder,
}: {
  onClose: () => void;
  selectOrder: Order;
}) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
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
    selectOrder.order_products.forEach((product) => {
      products.push({
        content: "",
        rating: 0,
        images: [],
        idProduct: product.product._id,
      });
    });
    replace(products);
  }, [replace, selectOrder]);
  const mutationCreateReview = useMutation({
    mutationFn: reviewApi.create,
    onSuccess: () => {
      toast.success("Thêm đánh giá thành công");
      onClose();
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
    <ModalPortal>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="w-[400px] hidden-scroll max-h-[600px] overflow-auto  bg-white px-7 pb-7 rounded-sm shadow-md  modal-content"
      >
        {fields.map((item, idx) => {
          return (
            <div
              key={item.id}
              className={`pt-5 pb-2 ${idx !== 0 && "border-t  border-gray3"}`}
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
        <div className="text-center mt-5">
          <button
            onClick={onClose}
            className="w-1/2  bg-white h-10 text-orange"
          >
            Trở về
          </button>
          <Button
            type="submit"
            label="Gửi đánh giá"
            className="w-1/2  bg-orange h-10 text-white"
            isLoading={isSubmitting}
          />
        </div>
      </form>
    </ModalPortal>
  );
}
