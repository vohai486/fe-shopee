import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { InputNumberField } from "../../form";
import { Button, Form } from "@/components/common";

export interface FormImportProductProps {
  handleImport: (quantity: number, price: number) => void;
  onCloseModal?: () => void;
  isLoading: boolean;
}
const schema = yup.object().shape({
  price: yup.number().min(1, "lớn hơn 0").required("Vui lòng nhập giá nhập"),
  quantity: yup.number().min(1, "lớn hơn 0").required("Vui lòng nhập số lượng"),
});
type FormData = {
  price: number;
  quantity: number;
};

export function FormImportProduct({
  handleImport,
  onCloseModal,
  isLoading,
}: FormImportProductProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      price: 0,
      quantity: 0,
    },
    shouldFocusError: false,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleSubmitForm = async (values: FormData) => {
    const { quantity, price } = values;
    await handleImport(quantity, price);
    onCloseModal?.();
  };
  return (
    <div className=" px-6">
      <div className="text-xl mb-4 text-title">Nhập hàng</div>
      <Form onSubmit={handleSubmit(handleSubmitForm)} className="w-[360px]">
        <Form.Row
          label="Số lượng nhập"
          error={errors["quantity"]?.message || ""}
          columns="1fr 1fr 1fr"
        >
          <InputNumberField
            hideError={true}
            control={control}
            name="quantity"
          />
        </Form.Row>
        <Form.Row
          columns="1fr 1fr 1fr"
          label="Giá nhập"
          error={errors["price"]?.message || ""}
        >
          <InputNumberField hideError={true} control={control} name="price" />
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
            isLoading={isLoading}
            label="Nhập hàng"
            type="submit"
            className="px-3 text-grey-0 rounded-md bg-blue-200 h-10 "
          ></Button>
        </div>
      </Form>
    </div>
  );
}
