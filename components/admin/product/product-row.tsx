import { ConfirmModal, Menus, Modal } from "@/components/common";
import { Checkbox } from "@/components/common/checkbox";
import Table from "@/components/common/table";
import { Product } from "@/types";
import { formatDate, formatPriceVND } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";

export function ProductRow({
  product,
  handleChecked,
  handleVerifyProduct,
  handleUnVerifyProduct,
}: {
  product: Product & { checked: boolean };
  handleChecked: (id: string, checked: boolean) => void;
  handleVerifyProduct: (id: string) => void;
  handleUnVerifyProduct: (id: string) => void;
}) {
  return (
    <Table.Row>
      <div>
        <Checkbox
          aria-describedby="helper-checkbox-text"
          type="checkbox"
          name={product._id}
          checked={product.checked}
          id={product._id}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChecked(product._id, e.target.checked);
          }}
        />
      </div>
      <div className="flex gap-x-2">
        <Image src={product.product_thumb} alt="" width={80} height={80} />
        <div className=" grow">
          <p className="line-clamp-2">{product.product_name}</p>
        </div>
      </div>
      <div>{formatDate(product.createdAt)}</div>
      <Menus.Menu>
        <Menus.Toggle id={product._id} />
        <Menus.List id={product._id}>
          {!product.verify && (
            <Modal.Open opens={`verify-${product._id}`}>
              <Menus.Button
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              >
                Duyệt sản phẩm
              </Menus.Button>
            </Modal.Open>
          )}
          {product.verify && (
            <Modal.Open opens={`un-verify-${product._id}`}>
              <Menus.Button
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              >
                Hủy Duyệt
              </Menus.Button>
            </Modal.Open>
          )}
        </Menus.List>
        <Modal.Window name={`verify-${product._id}`}>
          <ConfirmModal
            label="Xác nhận duyệt sản phẩm"
            onConfirm={() => handleVerifyProduct(product._id)}
          ></ConfirmModal>
        </Modal.Window>
        <Modal.Window name={`un-verify-${product._id}`}>
          <ConfirmModal
            label="Xác nhận"
            onConfirm={() => handleUnVerifyProduct(product._id)}
          ></ConfirmModal>
        </Modal.Window>
      </Menus.Menu>
    </Table.Row>
  );
}
