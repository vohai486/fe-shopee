import * as React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputNumberField } from "../form/input-number-field";
import Link from "next/link";
import { QuantityField } from "./quantity-field";
export interface IAddToCartFromProps {}

interface QuantityPayload {
  qty: number;
}

export function AddToCartFrom({
  quantity,
  onSubmit,
}: {
  quantity: number;
  onSubmit: (quantity: number) => void;
}) {
  const schema = yup.object().shape({
    qty: yup
      .number()
      .required("Please enter quantity")
      .min(1, "Minimun value is 1")
      .typeError("Please enter a number"),
  });
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<QuantityPayload>({
    defaultValues: {
      qty: 1,
    },
    resolver: yupResolver(schema),
  });
  const handleOnSubmit = async (values: QuantityPayload) => {
    onSubmit && (await onSubmit(values.qty));
  };
  const handleDecrement = () => {
    if (getValues("qty") <= 1) return;
    setValue("qty", +getValues("qty") - 1);
  };
  const handleIncrement = () => {
    setValue("qty", +getValues("qty") + 1);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (+e.target.value <= 1) return;
    setValue("qty", +e.target.value);
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="flex flex-col sm:flex-row  gap-y-2 sm:items-center gap-x-3">
        <div>Số Lượng</div>
        <QuantityField
          name="qty"
          control={control}
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
          handleChange={handleChange}
        />
        <span>{quantity > 0 && `có sẵn ${quantity}`} </span>
      </div>
      <div className="mt-5">
        <button className="flex text-base font-medium items-center gap-x-2  bg-blue-200 h-12 px-4 text-grey-0 rounded-md ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          <span>Thêm Vào Giỏ Hàng</span>
        </button>
      </div>
    </form>
  );
}
