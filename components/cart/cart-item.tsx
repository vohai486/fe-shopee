import { voucherApi } from "@/api-client/voucher-api";
import { useClickOutSide } from "@/hooks";
import { ExtendCartItem } from "@/types/cart.types";
import { formatPriceVND } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  MouseEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Voucher, VoucherPayload } from "@/types/voucher.types";
import { AppContext } from "@/contexts/app.context";
import { QuantityController } from "./quantity-controller";
import { VoucherList } from "./voucher-list";
import { Checkbox } from "../common/checkbox";
import Table from "../common/table";
import { createPortal } from "react-dom";
interface VoucherExtends extends Voucher {
  isChecked: boolean;
}
export interface CartItemProps {
  listProduct: ExtendCartItem[];
  handleCheckedAllShop: (idShop: string, checked: boolean) => void;
  handleChecked: (idProduct: string, checked: boolean) => void;
  handleQuantity: (productId: string, value: number) => void;
  handleDeleteCart: (productIds: string[]) => void;
}

export function CartItem({
  listProduct,
  handleCheckedAllShop,
  handleChecked,
  handleQuantity,
  handleDeleteCart,
}: CartItemProps) {
  const { listDiscount, setListDiscount } = useContext(AppContext);
  const divVoucherRef = useRef(null);
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [listVoucher, setListVoucher] = useState<VoucherExtends[]>([]);
  useClickOutSide(divVoucherRef, () => {
    setShow(false);
  });
  const { data, refetch } = useQuery({
    queryKey: ["voucher", listProduct[0].shop._id],
    queryFn: () =>
      voucherApi.getVoucherForUser({ shopId: listProduct[0].shop._id }),
    staleTime: 3 * 60 * 1000,
    enabled: !!listProduct[0]?.shop._id,
  });
  console.log(data?.metadata);
  const totalChecked = listProduct
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + item.product.product_price * item.quantity, 0);
  useEffect(() => {
    if (!data?.metadata || !Array.isArray(data?.metadata)) return;
    setListVoucher(() =>
      data.metadata.map((voucher, idx) => ({
        ...voucher,
        isChecked: idx === 0 || false,
      }))
    );
  }, [data]);
  const shopId = listProduct[0].shop._id;
  useEffect(() => {
    const numberVoucherIsUse = listVoucher.filter(
      (voucher) =>
        voucher.voucher_min_order_value <= totalChecked &&
        voucher.is_apply &&
        voucher.is_use
    ).length;
    if (numberVoucherIsUse === 0) {
      setListDiscount((prev) => {
        const cloneArr = [...prev];
        const foundIndexDiscount = prev.findIndex(
          (discount) => discount.shopId === shopId
        );
        cloneArr.splice(foundIndexDiscount, 1);
        return cloneArr;
      });

      return;
    }
    const discount = listVoucher.find(
      (voucher) => voucher.voucher_min_order_value <= totalChecked
    );
    if (!discount) return;
    setListDiscount((prev) => {
      const cloneArr = [...prev];
      const foundIndexDiscount = prev.findIndex(
        (discount) => discount.shopId === shopId
      );
      const { _id, voucher_code, voucher_value, voucher_min_order_value } =
        discount;
      if (foundIndexDiscount > -1) {
        cloneArr[foundIndexDiscount] = {
          _id,
          voucher_code,
          voucher_value,
          voucher_min_order_value,
          shopId,
        };
      } else {
        cloneArr.push({
          _id,
          voucher_code,
          voucher_value,
          voucher_min_order_value,
          shopId,
        });
      }
      return cloneArr;
    });
  }, [listVoucher, setListDiscount, shopId, totalChecked]);
  const applyVoucerMutation = useMutation({
    mutationFn: voucherApi.applyVoucher,
    onSuccess: () => {
      refetch();
    },
  });
  const handleApplyVoucher = (id: string) => {
    applyVoucerMutation.mutate({
      voucherId: id,
    });
  };
  const handleCheckedVoucher = (id: string) => {
    setListVoucher((prev) =>
      prev.map((voucher) => {
        if (voucher._id === id) {
          voucher.isChecked = true;
        } else {
          voucher.isChecked = false;
        }
        return voucher;
      })
    );
  };
  const handleChooseVoucher = () => {
    const voucher = listVoucher.find((voucher) => voucher.isChecked);
    if (!voucher) return;
    const { _id, voucher_code, voucher_value, voucher_min_order_value } =
      voucher;

    const voucherApply = {
      _id,
      voucher_code,
      voucher_value,
      voucher_min_order_value,
      shopId,
    };

    setListDiscount((prev) => {
      const cloneArr = [...prev];
      const foundIndexDiscount = prev.findIndex(
        (discount) => discount.shopId === voucherApply.shopId
      );
      if (foundIndexDiscount > -1) {
        cloneArr[foundIndexDiscount] = voucherApply;
      } else {
        cloneArr.push(voucherApply);
      }
      return cloneArr;
    });
    setShow(false);
  };
  return (
    <div className="mt-3 w-full relative border border-box bg-box rounded-md">
      <div className="py-3 flex  items-center px-4 sm:px-6 gap-3 md:gap-6">
        <div className="md:w-8">
          <Checkbox
            id={listProduct[0].shop._id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleCheckedAllShop(listProduct[0].shop._id, e.target.checked);
            }}
            checked={listProduct.every((item) => !!item.checked)}
          />
        </div>
        <div className="flex">
          {listProduct[0].shop.shop_name}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="w-5 h-5 ml-2 stroke-blue-200 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
        </div>
      </div>
      <div className="hidden md:block">
        {listProduct.map((item, index) => (
          <Table.Row key={item._id}>
            <Checkbox
              id={item._id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChecked(item.product._id, e.target.checked);
              }}
              checked={item.checked}
            />
            <div className="flex gap-x-3 items-start">
              <Image
                src={item.product.product_thumb}
                width={80}
                height={80}
                alt=""
                className="shrink-0"
              />
              <h3 className="line-clamp-2 text-base dark:text-grey-0 text-blue-300">
                {item.product.product_name}
              </h3>
            </div>
            <div>{formatPriceVND(item.product.product_price)}</div>
            <QuantityController
              value={item.quantity}
              handleDecrement={() =>
                handleQuantity(item.product._id, item.quantity - 1)
              }
              handleIncrement={() =>
                handleQuantity(item.product._id, item.quantity + 1)
              }
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleQuantity(item.product._id, +e.target.value);
              }}
            />
            <div className="text-blue-200">
              {formatPriceVND(item.product.product_price * item.quantity)}
            </div>
            <div
              onClick={() => handleDeleteCart([item.product._id])}
              className="grow text-center cursor-pointer w-[15%]"
            >
              Xóa
            </div>
          </Table.Row>
        ))}
      </div>
      <div className="md:hidden">
        {listProduct.map((item, index) => (
          <div
            className="[&:not(:last-child)]:border-b border-box py-3 gap-x-3 items-start px-4 sm:px-6 flex"
            key={item._id}
          >
            <div className="shrink-0 pt-5">
              <Checkbox
                id={item._id}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChecked(item.product._id, e.target.checked);
                }}
                checked={item.checked}
              />
            </div>
            <div className="sm:w-24 sm:h-24 h-20 w-20 shrink-0">
              <Image
                src={item.product.product_thumb}
                width={80}
                height={80}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grow flex flex-col gap-2 self-start">
              <h3 className="line-clamp-4 text-base dark:text-grey-0 text-blue-300">
                {item.product.product_name}
              </h3>
              <QuantityController
                value={item.quantity}
                handleDecrement={() =>
                  handleQuantity(item.product._id, item.quantity - 1)
                }
                handleIncrement={() =>
                  handleQuantity(item.product._id, item.quantity + 1)
                }
                handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleQuantity(item.product._id, +e.target.value);
                }}
              />
              <div className="text-blue-200">
                {formatPriceVND(item.product.product_price)}
              </div>
            </div>
          </div>
        ))}
      </div>
      {data && data?.metadata.length > 0 && (
        <div className="border-t flex  border-box py-4 sm:px-6 px-3 text-sm">
          <span className="text-blue-50 mr-4">
            {!!listDiscount.find(
              (item) => item.shopId === listProduct[0].shop._id
            )?.shopId
              ? `Shop Voucher giảm ${formatPriceVND(
                  listDiscount.find(
                    (item) => item.shopId === listProduct[0].shop._id
                  )?.voucher_value || 0
                )}`
              : "Chưa thể áp dụng Voucher"}
          </span>
          <span
            onClick={(
              e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
            ) => {
              e.stopPropagation();
              const target = e.target as HTMLElement;
              const parent = target.closest("div");
              if (parent) {
                console.log(parent);
                console.log(parent?.getBoundingClientRect());
              }
              setShow(true);
            }}
            className="text-blue-200 cursor-pointer"
          >
            Xem thêm
          </span>
        </div>
      )}
      {show &&
        createPortal(
          <div ref={divVoucherRef}>
            <div className="absolute z-50 rounded-md sm:right-[20%] right-0  bottom-0  pt-6 pb-0 bg-box border border-box shadow-sm-50  sm:w-[400px]">
              <div className="text-xl text-bold text-title mb-5 px-6">
                {listProduct[0].shop.shop_name}
              </div>
              <div
                className={`${
                  listProduct.length <= 2 ? "max-h-[200px]" : "max-h-[450px]"
                }  overflow-y-auto px-6`}
              >
                <VoucherList
                  handleApplyVoucher={handleApplyVoucher}
                  listVoucher={listVoucher || []}
                  handleCheckedVoucher={handleCheckedVoucher}
                />
              </div>
              <div className="mt-5 py-3 px-6 border-b border-t border-box flex justify-end gap-x-2">
                <button
                  onClick={() => setShow(false)}
                  className="uppercase border border-box text-title w-[120px] h-9 rounded-sm"
                >
                  Trở lại
                </button>
                <button
                  onClick={() => handleChooseVoucher()}
                  className="uppercase  bg-blue-200 text-grey-0 w-[120px] h-9 rounded-sm"
                >
                  OK
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
