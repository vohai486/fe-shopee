import { ConfirmModal, Menus, Modal } from "@/components/common";
import { Checkbox } from "@/components/common/checkbox";
import Table from "@/components/common/table";
import { Shop } from "@/types";
import { formatDate } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";

export function ShopRow({
  shop,
  handleChecked,
  handleActive,
  handleInActive,
}: {
  shop: Shop & { checked: boolean };
  handleChecked: (id: string, checked: boolean) => void;
  handleActive: (id: string) => void;
  handleInActive: (id: string) => void;
}) {
  return (
    <Table.Row>
      <div className="flex gap-x-2">
        <Image src={shop.shop_avatar} alt="" width={80} height={80} />
        <div className=" grow">
          <p className="line-clamp-2">{shop.shop_name}</p>
        </div>
      </div>
      <div>{formatDate(shop.createdAt)}</div>
      <div>
        {shop.shop_status === "active" ? (
          <span className="bg-green-50 rounded-xl text-grey-0  px-1">
            Active
          </span>
        ) : (
          <span className="bg-red-100 rounded-xl px-1 text-grey-0">
            Inactive
          </span>
        )}
      </div>
      <Menus.Menu>
        <Menus.Toggle id={shop._id} />
        <Menus.List id={shop._id}>
          {shop.shop_status === "inactive" && (
            <Modal.Open opens={`active-${shop._id}`}>
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
                Active
              </Menus.Button>
            </Modal.Open>
          )}
          {shop.shop_status === "active" && (
            <Modal.Open opens={`inactive-${shop._id}`}>
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
                Inactive
              </Menus.Button>
            </Modal.Open>
          )}
        </Menus.List>
        <Modal.Window name={`active-${shop._id}`}>
          <ConfirmModal
            label="Xác nhận active shop"
            onConfirm={() => handleActive(shop._id)}
          ></ConfirmModal>
        </Modal.Window>
        <Modal.Window name={`inactive-${shop._id}`}>
          <ConfirmModal
            label="Xác nhận inactive shop"
            onConfirm={() => handleInActive(shop._id)}
          ></ConfirmModal>
        </Modal.Window>
      </Menus.Menu>
    </Table.Row>
  );
}
