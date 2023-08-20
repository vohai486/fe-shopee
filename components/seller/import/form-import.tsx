import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { InputNumberField } from "../../form";
import { ModalPortal } from "@/components/common";

export interface FormImportProductProps {
  onClose: () => void;
  idSelect: string;
  handleImport: (quantity: number, price: number) => void;
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
  onClose,
  idSelect,
  handleImport,
}: FormImportProductProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues: {
      price: 0,
      quantity: 0,
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleSubmitForm = async (values: FormData) => {
    const { quantity, price } = values;
    await handleImport(quantity, price);
    onClose();
  };
  return (
    <ModalPortal>
      <div className="w-[250px]  bg-white p-5 rounded-sm shadow-md  modal-content">
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="grid grid-cols-2 gap-x-2 gap-y-4"
        >
          <div className="col-span-1">Số lượng nhập</div>
          <div className="col-span-1">Giá nhập</div>
          <div className="col-span-1">
            <InputNumberField
              hideError={true}
              control={control}
              name="quantity"
            />
          </div>
          <div className="col-span-1">
            <InputNumberField hideError={true} control={control} name="price" />
          </div>
          <div className="col-span-2 flex">
            <button
              onClick={onClose}
              type="button"
              className=" text-orange bg-white w-full h-8"
            >
              Trở lại
            </button>
            <button type="submit" className=" text-white bg-orange w-full h-8">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}
