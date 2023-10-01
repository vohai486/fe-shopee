import { Modal } from "@/components/common";
import { FormProduct } from "./form-product";

export function AddProduct() {
  return (
    <>
      <Modal.Open opens="add-product">
        <button className="text-grey-0 text-sm py-3 px-4 rounded-md bg-blue-200">
          Thêm sản phẩm
        </button>
      </Modal.Open>
      <Modal.Window name="add-product">
        <FormProduct />
      </Modal.Window>
    </>
  );
}
