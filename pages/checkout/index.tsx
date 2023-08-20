import { userApi } from "@/api-client";
import { checkoutApi } from "@/api-client/checkout-api";
import { Loading } from "@/components/common";
import { ProtectedLayout } from "@/components/layouts";
import { formatPriceVND, generateNameId, getErrorMessage } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const [typePayment, setTypePayment] = useState<"cod" | "vnpay">("cod");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: dataAddress, refetch: refetchAddress } = useQuery({
    queryKey: ["address"],
    queryFn: userApi.getAddress,
    staleTime: 3 * 60 * 1000,
  });
  const encodedState = router.query.state;
  const body = encodedState
    ? JSON.parse(decodeURIComponent(encodedState as string))
    : {};
  const { data, isFetching } = useQuery({
    queryKey: ["checkout-review", router.query],
    queryFn: () => checkoutApi.checkoutReview(body),
    enabled: !!router.query.state,
    staleTime: 60 * 1000,
  });
  const orderCodMutation = useMutation({
    mutationFn: checkoutApi.order,
    onSuccess: () => {
      // toast.success("Đặt hàng thành công");
      queryClient.invalidateQueries(["carts"]);
      router.push("/user/purchase");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
  const createPaymentUrl = useMutation({
    mutationFn: checkoutApi.createPaymentUrl,
    onSuccess: () => {
      // toast.success("Đặt hàng thành công");
      // queryClient.invalidateQueries(["carts"]);
      // router.push("/user/purchase");
    },
    onError: (error) => {
      // toast.error(getErrorMessage(error));
    },
  });

  const addressDefault =
    dataAddress?.metadata && dataAddress.metadata.length > 0
      ? dataAddress.metadata[0]
      : null;
  const handleOrder = async () => {
    if (typePayment === "cod") {
      orderCodMutation.mutate(body);
    } else {
      const data = await createPaymentUrl.mutateAsync(body);
      router.push(data.metadata);
    }
  };

  const canOrder =
    data?.metadata &&
    data.metadata.shop_order_ids_new
      .flatMap((item) => item.itemProducts)
      .every((item) => item.checkStock);
  if (isFetching) {
    return <Loading />;
  }
  return (
    <div className="container">
      <div className="mt-3 px-4 py-7 lg:px-8  bg-white shadow-sm border-t-4 border-t-orange">
        <div className="mb-5 text-lg text-orange flex gap-x-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 stroke-orange"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          <span>Địa Chỉ Nhận Hàng</span>
        </div>
        <div className="text-sm sm:text-base">
          {addressDefault && (
            <>
              <span className="font-bold  ">
                {addressDefault?.fullName} (+84) {addressDefault?.phoneNumber}
              </span>
              <span className="mx-3">
                {addressDefault?.street}, {addressDefault?.ward},{" "}
                {addressDefault?.district}, {addressDefault?.city}
              </span>
            </>
          )}

          <span className="border border-orange px-2 inline-block text-[10px] rounded-sm">
            Mặc Định
          </span>
          <Link href="/user/address" className="text-blue ml-3 text-sm ">
            Thay Đổi
          </Link>
        </div>
      </div>
      <div className="bg-white mt-3 text-sm py-6 px-7 md:block hidden">
        <div className="flex justify-between">
          <div className="w-1/2 text-lg font-medium">Sản phẩm</div>
          <div className="w-2/5 text-gray2 flex">
            <div className="w-1/3 text-center">Đơn giá</div>
            <div className="w-1/3 text-center">Số lượng</div>
            <div className="w-1/3 text-right">Thành tiền</div>
          </div>
        </div>
      </div>
      {data?.metadata.shop_order_ids_new.map((listProductShop) => (
        <div
          key={listProductShop.shop.id}
          className="mt-3 text-sm bg-white py-6 px-4 md:px-7 pb-0"
        >
          <div className="flex gap-x-2 mb-5 items-center">
            <div>{listProductShop.shop.name}</div>{" "}
            <span className="text-gray1">|</span>{" "}
            <div className="flex gap-x-1 text-orange">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 stroke-orange"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              </svg>
              <span>Chat ngay</span>
            </div>
          </div>
          {listProductShop.itemProducts.length > 0 &&
            listProductShop.itemProducts.map((product, idx) => {
              return (
                <Link
                  href={generateNameId({
                    name: product.name,
                    id: product.productId,
                  })}
                  key={product.productId}
                >
                  {idx > 0 && <div className="h-[1px]  bg-gray w-full"></div>}
                  <div className="py-5  justify-between md:flex hidden">
                    <div className="w-1/2 flex gap-x-2 items-center">
                      <Image
                        src={product.thumb}
                        alt=""
                        width={80}
                        height={80}
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                      />
                      <span>{product.name}</span>
                    </div>
                    <div className="w-2/5  flex items-center">
                      <div className="w-1/3 text-center">
                        {formatPriceVND(product.price)}
                      </div>
                      <div className="w-1/3 text-center">
                        {!product.checkStock ? (
                          <div>
                            {product.quantity}{" "}
                            <span className="text-red">
                              (còn {product.countStock} sản phẩm)
                            </span>
                          </div>
                        ) : (
                          product.quantity
                        )}
                      </div>
                      <div className="w-1/3 text-right">
                        {formatPriceVND(product.productTotal)}
                      </div>
                    </div>
                  </div>
                  <div className="py-5 flex gap-x-5 md:hidden">
                    <div className="w-20 h-20">
                      <Image
                        src={product.thumb}
                        alt=""
                        width={80}
                        height={80}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="grow flex flex-col">
                      <span className="line-clamp-2 mb-3">{product.name}</span>
                      <div className="flex gap-x-10 mb-3  justify-between">
                        <span>{product.quantity} sản phẩm</span>
                        <span>{formatPriceVND(product.price)}</span>
                      </div>
                      {!product.checkStock && (
                        <span className="text-red mb-3">
                          (còn {product.countStock} sản phẩm)
                        </span>
                      )}
                      <div className="text-right text-orange">
                        {formatPriceVND(product.productTotal)}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          {listProductShop.priceDiscount > 0 && (
            <div className="py-5 border-t border-b border-dashed border-gray1 flex justify-end gap-x-10">
              <div>Voucher của Shop: </div>
              <div> - {formatPriceVND(listProductShop.priceDiscount)}</div>
            </div>
          )}
          <div className="py-5 border-t border-b border-dashed border-gray1 flex justify-end gap-x-10">
            <div>Tiền ship: </div>
            <div className="min-w-[100px] text-right">
              {formatPriceVND(listProductShop.feeShip)}
            </div>
          </div>
          <div className="py-5 flex justify-end gap-x-10">
            <div className="text-gray2">
              Tổng số tiền ({listProductShop.itemProducts.length} sản phẩm){" "}
            </div>
            <div className="text-orange min-w-[100px] text-right">
              {formatPriceVND(listProductShop.totalCheckout)}
            </div>
          </div>
        </div>
      ))}
      <div className="my-3 bg-white py-6 px-4 md:px-7 pb-0 text-sm">
        <div className="flex sm:flex-row flex-col gap-y-3 gap-x-3 sm:items-center">
          <div className="text-lg font-medium">Phương thức thanh toán</div>
          <div className="flex items-center gap-x-3">
            <button
              onClick={() => setTypePayment("cod")}
              className={`py-1 inline-block px-2 border border-gray1 cursor-pointer ${
                typePayment === "cod" && "border-orange text-orange"
              }`}
            >
              Thanh toán khi nhận hàng
            </button>
            <button
              onClick={() => setTypePayment("vnpay")}
              className={`py-1 inline-block px-2 border border-gray1 cursor-pointer ${
                typePayment === "vnpay" && "border-orange text-orange"
              }`}
            >
              Vnpay
            </button>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_max-content_max-content] py-4 gap-x-2 gap-y-3">
          <div className="sm:col-start-2 col-start-1 flex col-end-3  text-gray2 items-center">
            Tổng tiền hàng
          </div>
          <div className="px-3 min-w-[100px] text-right">
            {formatPriceVND(data?.metadata.checkout_order.totalPrice || 0)}
          </div>
          <div className="sm:col-start-2 flex col-start-1 col-end-3 text-gray2 items-center">
            Phí vận chuyển
          </div>
          <div className="px-3 min-w-[100px] text-right">
            {formatPriceVND(data?.metadata.checkout_order.feeShip || 0)}
          </div>
          <div className="sm:col-start-2 flex col-start-1 col-end-3 text-gray2 items-center">
            Tổng cộng Voucher giảm giá:
          </div>
          <div className="px-3 min-w-[100px] text-right">
            - {formatPriceVND(data?.metadata.checkout_order.totalDiscount || 0)}
          </div>
          <div className="sm:col-start-2 flex col-start-1 col-end-3 text-gray2 items-center">
            Tổng thanh toán:
          </div>
          <div className="px-3 sm:min-w-[100px] text-right text-orange text-2xl">
            {formatPriceVND(data?.metadata.checkout_order.totalCheckout || 0)}
          </div>
        </div>
        <div className="flex justify-center sm:justify-end  py-3 border-t border-gray1 border-dashed">
          <button
            className={`h-10 w-[200px] bg-orange text-white ${
              !canOrder && "pointer-events-none cursor-not-allowed bg-orange/20"
            } `}
            onClick={handleOrder}
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
}
CheckoutPage.Layout = ProtectedLayout;
