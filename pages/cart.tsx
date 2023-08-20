import { userApi } from "@/api-client";
import { cartApi } from "@/api-client/cart-api";
import { CartItem } from "@/components/cart";
import { Loading } from "@/components/common";
import { ProtectedLayout } from "@/components/layouts";
import { AppContext } from "@/contexts/app.context";
import { collectListByShop, formatPriceVND } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo } from "react";
import { toast } from "react-toastify";

export default function CartPage() {
  const router = useRouter();
  const { listItemCart, setListItemCart, listDiscount } =
    useContext(AppContext);
  const { data: dataAddress, refetch: refetchAddress } = useQuery({
    queryKey: ["address"],
    queryFn: userApi.getAddress,
    staleTime: 3 * 60 * 1000,
  });
  const addressDefault =
    dataAddress?.metadata && dataAddress.metadata.length > 0
      ? dataAddress.metadata[0]
      : null;
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["carts"],
    queryFn: () => cartApi.getCart(),
    staleTime: 3 * 60 * 1000,
  });
  useEffect(() => {
    if (!data) return;
    setListItemCart(
      (prev) =>
        data?.metadata.cart_products.map((item) => ({
          ...item,
          checked: prev.find((ele) => ele._id === item._id)?.checked || false,
        })) || []
    );
  }, [data, setListItemCart]);
  const updateCartMutaion = useMutation({
    mutationFn: cartApi.updateCart,
    onSuccess: () => {
      refetch();
    },
  });
  const deleteCartMutaion = useMutation({
    mutationFn: cartApi.deleteCart,
    onSuccess: () => {
      refetch();
    },
  });
  const totalDiscount = useMemo(
    () =>
      listDiscount.reduce((sum, ele) => {
        const totalPriceCheckByShop = listItemCart
          .filter((item) => item.shop._id === ele.shopId && item.checked)
          .reduce(
            (sum, item) => sum + item.quantity * item.product.product_price,
            0
          );

        if (totalPriceCheckByShop > ele.voucher_min_order_value) {
          return sum + ele.voucher_value;
        }
        return sum;
      }, 0),
    [listDiscount, listItemCart]
  );
  const totalPriceItemChecked = listItemCart
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + item.quantity * item.product.product_price, 0);
  const handleChecked = (idProduct: string, checked: boolean) => {
    setListItemCart((prev) =>
      prev.map((item) => {
        if (item.product._id === idProduct) {
          item.checked = checked;
        }
        return item;
      })
    );
  };
  const handleCheckedAllShop = (idShop: string, checked: boolean) => {
    setListItemCart((prev) =>
      prev.map((item) => {
        if (item.shop._id === idShop) {
          item.checked = checked;
        }
        return item;
      })
    );
  };
  const handleCheckedAll = (checked: boolean) => {
    setListItemCart((prev) =>
      prev.map((item) => {
        item.checked = checked;
        return item;
      })
    );
  };
  const handleQuantity = (productId: string, value: number) => {
    if (value <= 0) handleDeleteCart([productId]);
    else
      updateCartMutaion.mutate({
        productId,
        quantity: value,
      });
  };
  const handleDeleteCart = (productIds: string[]) => {
    deleteCartMutaion.mutate({
      productIds,
    });
  };

  const handleCheckoutReview = () => {
    if (!data || listItemCart.filter((item) => item.checked).length === 0) {
      toast.error(<div>Chọn sản phẩm muốn mua</div>, {
        position: "top-center",
      });
      return;
    }

    if (!addressDefault) {
      toast.error(
        <div>
          <Link href="/user/address">Vui lòng chọn địa chỉ giao tại đây</Link>
        </div>,
        {
          autoClose: 4000,
          position: "top-center",
        }
      );
      return;
    }
    const cartId = data.metadata._id;
    const shop_order_ids = collectListByShop(
      listItemCart.filter((item) => item.checked)
    ).map((listProduct) => {
      const discountShop = listDiscount.find(
        (item) => item.shopId === listProduct[0].shop._id
      );
      return {
        shopId: listProduct[0].shop._id,
        shop_discounts: discountShop
          ? [
              {
                shopId: discountShop.shopId,
                voucherId: discountShop._id,
                codeId: discountShop.voucher_code,
              },
            ]
          : [],
        items_products: listProduct.map((product) => ({
          price: product.product.product_price,
          quantity: product.quantity,
          productId: product.product._id,
        })),
      };
    });
    const params = encodeURIComponent(
      JSON.stringify({
        cartId,
        shop_order_ids,
        user_address: addressDefault || {},
      })
    );
    router.push({
      pathname: "/checkout",
      query: {
        state: params,
      },
    });
  };

  if (data?.metadata && data.metadata?.cart_products.length === 0) {
    return (
      <div className="py-5  text-sm">
        <div className="container px-3 xl:px-0">
          <div className="py-5 bg-white border border-orange bg-orange/5 flex gap-y-3 items-center flex-col">
            <div className="px-2 text-center">
              Không có sản phẩm nào trong giỏ hàng của bạn.
            </div>
            <Link
              href="/"
              className="bg-orange py-2 rounded-sm px-4 text-white"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) return <Loading />;

  return (
    <div className="py-5 text-sm ">
      <div className="container relative">
        <div className="px-5 bg-white hidden  md:grid grid-cols-10 items-center">
          <div className="col-span-5 flex h-14 items-center">
            <div className="flex items-center h-5 px-5">
              <input
                aria-describedby="helper-checkbox-text"
                type="checkbox"
                className="checkbox rounded-sm checkbox-accent w-4 h-4"
                checked={listItemCart.every((item) => item.checked)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleCheckedAll(e.target.checked);
                }}
              />
            </div>
            <div className="grow">Sản phẩm</div>
          </div>
          <div className="col-span-5 flex">
            <div className="grow text-center w-[30%]">Đơn Giá</div>
            <div className="grow text-center w-[35%]">Số Lượng</div>
            <div className="grow text-center w-[20%]">Số Tiền</div>
            <div className="grow text-center w-[15%] cursor-pointer">Xóa</div>
          </div>
        </div>
        {collectListByShop(listItemCart).map((listProduct, idx) => {
          return (
            <div key={listProduct[0]._id}>
              <CartItem
                listProduct={listProduct}
                handleChecked={handleChecked}
                handleCheckedAllShop={handleCheckedAllShop}
                handleDeleteCart={handleDeleteCart}
                handleQuantity={handleQuantity}
              />
            </div>
          );
        })}
        <div className="sticky z-30 bottom-0 py-3 lg:text-base text-sm w-full mt-3 bg-white px-2 sm:px-5">
          <div className="col-span-5 justify-between flex md:flex-row flex-col gap-y-3 md:items-center">
            <div className="flex grow justify-between md:justify-normal items-center md:pl-5 h-5 gap-x-5">
              <div className="flex items-center gap-x-2">
                <input
                  aria-describedby="helper-checkbox-text"
                  type="checkbox"
                  className="checkbox rounded-sm checkbox-accent w-4 h-4"
                  checked={listItemCart.every((item) => item.checked)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleCheckedAll(e.target.checked);
                  }}
                />
                <span>Chọn Tất Cả ({listItemCart.length})</span>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  const filterIds = listItemCart.reduce(
                    (result: string[], item) => {
                      if (item.checked) {
                        result.push(item.product._id);
                      }
                      return result;
                    },
                    []
                  );
                  handleDeleteCart(filterIds);
                }}
              >
                Xóa
              </div>
            </div>
            <div className="grow md:mt-0 mt-2 md:justify-end justify-between md:flex-row flex-col gap-y-3 flex  gap-x-5 items-center">
              <div className="flex gap-x-4 w-full  md:w-[unset] sm:justify-between items-center">
                <div>
                  Tổng thanh toán (
                  {listItemCart.filter((item) => item.checked).length} Sản
                  phẩm):{" "}
                </div>
                <div className="flex flex-col">
                  <span className="text-orange text-lg md:text-2xl">
                    {formatPriceVND(totalPriceItemChecked - totalDiscount)}
                  </span>
                  {totalDiscount > 0 && (
                    <span className="text-orange text-sm">
                      Tiết kiệm: {formatPriceVND(totalDiscount)}
                    </span>
                  )}
                </div>
              </div>
              <button
                className={`text-white bg-orange text-sm  py-2 px-4 rounded-sm ${
                  listItemCart.filter((item) => item.checked).length <= 0 &&
                  "pointer-events-none bg-opacity-70 "
                }`}
                onClick={handleCheckoutReview}
              >
                Mua Hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CartPage.Layout = ProtectedLayout;
