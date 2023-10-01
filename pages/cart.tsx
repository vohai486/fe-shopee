import { userApi } from "@/api-client";
import { cartApi } from "@/api-client/cart-api";
import { CartItem } from "@/components/cart";
import { Loading } from "@/components/common";
import { Checkbox } from "@/components/common/checkbox";
import Table from "@/components/common/table";
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

  if (!data || (data?.metadata && data.metadata?.cart_products.length === 0)) {
    return (
      <div className="py-5  text-sm">
        <div className="container px-3 xl:px-0">
          <div className="py-5  border  rounded-md border-box bg-box flex gap-y-3 items-center flex-col">
            <div className="px-2 text-center">
              Không có sản phẩm nào trong giỏ hàng của bạn.
            </div>
            <Link
              href="/"
              className="bg-blue-200 py-2 rounded-sm px-4 text-grey-0"
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
    <div className="text-sm relative">
      <Table columns="2rem 4fr 1.25fr 1.75fr 1.25fr 2rem">
        <Table.Header className="hidden md:grid">
          <div>
            <Checkbox
              id="all"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleCheckedAll(e.target.checked);
              }}
              checked={listItemCart.every((item) => item.checked)}
            />
          </div>
          <div>Sản phẩm</div>
          <div>Đơn Giá</div>
          <div>Số Lượng</div>
          <div>Thành Tiền</div>
          <div>Xóa</div>
        </Table.Header>
        <Table.Body
          data={collectListByShop(listItemCart)}
          render={(listProduct) => {
            return (
              <CartItem
                key={listProduct[0]._id}
                listProduct={listProduct}
                handleChecked={handleChecked}
                handleCheckedAllShop={handleCheckedAllShop}
                handleDeleteCart={handleDeleteCart}
                handleQuantity={handleQuantity}
              />
            );
          }}
        ></Table.Body>
      </Table>
      <div className="sticky z-30 bottom-0 py-3 text-sm w-full mt-3  border rounded-md border-box bg-box px-4 sm:px-6">
        <div className="col-span-5 justify-between flex md:flex-row flex-col gap-y-3 md:items-center">
          <div className="flex grow justify-between md:justify-normal items-center h-5 gap-x-5">
            <div className="flex items-center gap-3">
              <Checkbox
                id="all-cart"
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
                {listItemCart.filter((item) => item.checked).length} Sản phẩm):{" "}
              </div>
              <div className="flex flex-col">
                <span className="text-blue-200 text-lg md:text-2xl">
                  {formatPriceVND(totalPriceItemChecked - totalDiscount)}
                </span>
                {totalDiscount > 0 && (
                  <span className="text-blue-200/90 text-sm">
                    Tiết kiệm: {formatPriceVND(totalDiscount)}
                  </span>
                )}
              </div>
            </div>
            <button
              className={`text-grey-0 bg-blue-200 text-sm  py-2 px-4 rounded-sm ${
                listItemCart.filter((item) => item.checked).length <= 0 &&
                "pointer-events-none"
              }`}
              disabled={listItemCart.filter((item) => item.checked).length <= 0}
              onClick={handleCheckoutReview}
            >
              Mua Hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

CartPage.Layout = ProtectedLayout;
