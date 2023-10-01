import { Modal } from "@/components/common";
import { FormAddressUser } from "./form-address-user";

export function AddAddress() {
  return (
    <Modal>
      <Modal.Open opens="add-address">
        <button className="flex h-10 w-44 items-center rounded-sm gap-x-2 bg-blue-200 justify-center text-grey-0">
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Thêm địa chỉ mới
        </button>
      </Modal.Open>
      <Modal.Window name="add-address">
        <FormAddressUser />
      </Modal.Window>
    </Modal>
  );
}
