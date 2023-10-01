import { Modal } from "@/components/common";
import { FormVoucher } from "./form-voucher";

export function AddVoucher() {
  return (
    <Modal>
      <Modal.Open opens="add-product">
        <button className="text-grey-0 text-sm py-3 px-4 rounded-md bg-blue-200">
          Thêm Voucher
        </button>
      </Modal.Open>
      <Modal.Window name="add-product">
        <FormVoucher />
      </Modal.Window>
    </Modal>
  );
}
