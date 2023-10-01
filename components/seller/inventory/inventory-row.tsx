import { Menus, Modal } from "@/components/common";
import Table from "@/components/common/table";
import { InventoryManage } from "@/types";
import Image from "next/image";
import { FormImportProduct } from "../import";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryApi } from "@/api-client";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export interface InventoryRowProps {
  inventory: InventoryManage;
}

const options = [
  {
    class: "",
    label: "Bình thường",
  },
  {
    class: "text-yellow-300",
    label: "Bổ sung hàng sớm",
  },
  {
    class: "text-red-700 dark:text-red-700-dark",
    label: "Bổ sung hàng ngay lập tức",
  },
];
export function InventoryRow({ inventory }: InventoryRowProps) {
  const { query } = useRouter();
  const queryClient = useQueryClient();
  const status =
    inventory.inven_stock === 0
      ? options[2]
      : inventory.inven_stock < 10
      ? options[1]
      : options[0];

  const { mutate, isLoading } = useMutation({
    mutationFn: inventoryApi.importProduct,
    onSuccess: () => {
      toast.success("Nhập hàng thành công");
      queryClient.invalidateQueries(["inventory", query]);
    },
  });
  const handleImport = (quantity: number, price: number) => {
    mutate({
      productId: inventory.inven_productId._id,
      quantity,
      price,
    });
  };

  return (
    <>
      <div className={`text-right ${status.class} pr-6 pt-2`}>
        {status.label}
      </div>
      <Table.Row>
        <div className="flex gap-2">
          <Image
            src={inventory.inven_productId.product_thumb}
            alt=""
            width={40}
            height={40}
          />
          <p className="line-clamp-2">
            {inventory.inven_productId.product_name}
          </p>
        </div>
        <div>{inventory.sell_7_days || 0}</div>
        <div>{inventory.sell_30_days || 0}</div>
        <div>{inventory.inven_stock}</div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={inventory._id} />
            <Menus.List id={inventory._id}>
              <Modal.Open opens="import">
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
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                  onClick={() => {}}
                >
                  Nhập hàng
                </Menus.Button>
              </Modal.Open>
            </Menus.List>
            <Modal.Window name="import">
              <FormImportProduct
                handleImport={handleImport}
                isLoading={isLoading}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </Table.Row>
    </>
  );
}
