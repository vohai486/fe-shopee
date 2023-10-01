import { userApi } from "@/api-client";
import { checkoutApi } from "@/api-client/checkout-api";
import { Loading } from "@/components/common";
import Table from "@/components/common/table";
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
    <>
      <div className="mb-3 p-6 shadow-sm-50 border-box border border-t-2 dark:border-t-blue-200 border-t-blue-200 bg-box rounded-md">
        <div className="mb-5 text-lg text-brand-600 flex gap-x-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="w-6 h-6 stroke-current"
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
          <h3 className="text-title">Địa Chỉ Nhận Hàng</h3>
        </div>
        <div className="text-sm sm:text-base">
          {addressDefault && (
            <>
              <span className="font-bold  ">
                {addressDefault?.fullName} (+84) {addressDefault?.phoneNumber}
              </span>
              <span className="mx-3 text-blue-50">
                {addressDefault?.street}, {addressDefault?.ward},{" "}
                {addressDefault?.district}, {addressDefault?.city}
              </span>
            </>
          )}

          <span className="border border-blue-200 px-2 inline-block text-xs py-1 rounded-sm">
            Mặc Định
          </span>
          <Link
            href="/user/address"
            className="text-blue-200 font-medium ml-3 text-sm "
          >
            Thay Đổi
          </Link>
        </div>
      </div>
      <Table columns="4fr 2fr 2fr 2fr">
        <Table.Header className="hidden md:grid">
          <div>Sản phẩm</div>
          <div className="text-center">Đơn Giá</div>
          <div className="text-center">Số Lượng</div>
          <div className="text-right">Thành Tiền</div>
        </Table.Header>
        <Table.Body
          data={data?.metadata.shop_order_ids_new || []}
          render={(listProductShop) => {
            return (
              <div
                key={listProductShop.shop.id}
                className="mt-3 text-sm bg-box border border-box rounded-md"
              >
                <div className="flex gap-x-2  px-4 py-3 items-center">
                  <div>{listProductShop.shop.name}</div> <span>|</span>{" "}
                  <div className="flex gap-x-1 text-blue-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      className="w-5 h-5 stroke-current"
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
                        <div className="md:block hidden">
                          <Table.Row>
                            <div className="flex gap-x-2 items-start">
                              <Image
                                src={product.thumb}
                                alt=""
                                width={80}
                                height={80}
                                className="object-cover shrink-0"
                              />
                              <h3 className="line-clamp-2 text-title">
                                {product.name}
                              </h3>
                            </div>
                            <div className="text-center">
                              {formatPriceVND(product.price)}
                            </div>
                            <div className="text-center">
                              {product.quantity}
                              {!product.checkStock && (
                                <div className="text-red-100">
                                  (còn {product.countStock} sản phẩm)
                                </div>
                              )}
                            </div>
                            <div className="text-right text-blue-200">
                              {formatPriceVND(product.productTotal)}
                            </div>
                          </Table.Row>
                        </div>
                        <div className="md:hidden items-start flex py-3 px-6 gap-x-6">
                          <Image
                            src={product.thumb}
                            alt=""
                            width={80}
                            height={80}
                            className="object-cover shrink-0"
                          />
                          <div className="flex flex-col gap-2">
                            <h3 className="line-clamp-2 text-title">
                              {product.name}
                            </h3>
                            <div className="flex gap-6 items-center">
                              {formatPriceVND(product.price)}
                              <div className="w-5 h-5 flex items-center justify-center rounded-full text-xs text-grey-0 bg-blue-200">
                                {product.quantity}
                              </div>
                            </div>
                            {!product.checkStock && (
                              <div className="text-red-100">
                                (còn {product.countStock} sản phẩm)
                              </div>
                            )}
                            <div className=" text-base text-blue-200">
                              {formatPriceVND(product.productTotal)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                {listProductShop.priceDiscount > 0 && (
                  <div className="border-t py-2 border-b border-dashed border-box">
                    <Table.Row>
                      <div className="md:block hidden"></div>
                      <div className="md:block hidden"></div>
                      <div className="col-span-2 md:col-span-1">
                        Voucher của Shop:
                      </div>
                      <div className="text-right col-span-2 md:col-span-1">
                        - {formatPriceVND(listProductShop.priceDiscount)}
                      </div>
                    </Table.Row>
                  </div>
                )}
                <div className="border-t py-2 border-b border-dashed border-box">
                  <Table.Row>
                    <div className="md:block hidden"></div>
                    <div className="md:block hidden"></div>
                    <div className="col-span-2 md:col-span-1">Tiền ship:</div>
                    <div className="text-right col-span-2 md:col-span-1">
                      {formatPriceVND(listProductShop.feeShip)}
                    </div>
                  </Table.Row>
                </div>
                <div className="border-t py-2 border-dashed border-box">
                  <Table.Row>
                    <div className="md:block hidden"></div>
                    <div className="md:block hidden"></div>
                    <div className="col-span-2 md:col-span-1">
                      Tổng số tiền:
                    </div>
                    <div className="text-blue-200 font-semibold text-right col-span-2 md:col-span-1">
                      {formatPriceVND(listProductShop.totalCheckout)}
                    </div>
                  </Table.Row>
                </div>
              </div>
            );
          }}
        ></Table.Body>
      </Table>

      <div className="mt-3 border border-box bg-box rounded-md text-sm">
        <div className="flex px-6 py-3 sm:flex-row flex-col gap-y-3 gap-x-3 sm:items-center">
          <div className="text-lg font-medium text-title">
            Phương thức thanh toán
          </div>
          <div className="flex items-center gap-x-3">
            <button
              onClick={() => setTypePayment("cod")}
              className={`py-1 px-2 inline-block border border-box cursor-pointer ${
                typePayment === "cod" &&
                "dark:border-blue-200 border-blue-200 text-blue-200"
              }`}
            >
              Trực tiếp
            </button>
            <button
              onClick={() => setTypePayment("vnpay")}
              className={`py-1 inline-block px-2 border border-box cursor-pointer ${
                typePayment === "vnpay" &&
                "dark:border-blue-200 border-blue-200 text-blue-200"
              }`}
            >
              Vnpay
            </button>
          </div>
        </div>
        <Table columns="4fr 2fr 2fr 2fr">
          <Table.Row>
            <div className="md:block hidden"></div>
            <div className="md:block hidden"></div>
            <div className="col-span-2 md:col-span-1">Tổng tiền hàng:</div>
            <div className="text-right col-span-2 md:col-span-1">
              {formatPriceVND(data?.metadata.checkout_order.totalPrice || 0)}
            </div>
          </Table.Row>
          <Table.Row>
            <div className="md:block hidden"></div>
            <div className="md:block hidden"></div>
            <div className="col-span-2 md:col-span-1">Phí vận chuyển:</div>
            <div className="text-right col-span-2 md:col-span-1">
              {formatPriceVND(data?.metadata.checkout_order.feeShip || 0)}
            </div>
          </Table.Row>
          <Table.Row>
            <div className="md:block hidden"></div>
            <div className="md:block hidden"></div>
            <div className="col-span-2 md:col-span-1">Voucher giảm giá:</div>
            <div className="text-right col-span-2 md:col-span-1">
              -
              {formatPriceVND(data?.metadata.checkout_order.totalDiscount || 0)}
            </div>
          </Table.Row>
          <Table.Row>
            <div className="md:block hidden"></div>
            <div className="md:block hidden"></div>
            <div className="col-span-2 md:col-span-1">Tổng thanh toán:</div>
            <div className="text-right col-span-2 md:col-span-1 text-base text-blue-200 font-semibold">
              {formatPriceVND(data?.metadata.checkout_order.totalCheckout || 0)}
            </div>
          </Table.Row>
        </Table>

        <div className="flex justify-center sm:justify-end py-3 border-t border-box border-dashed">
          <button
            className={`h-10 w-[200px] bg-blue-200 rounded-md text-grey-0`}
            disabled={!canOrder}
            onClick={handleOrder}
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </>
  );
}
CheckoutPage.Layout = ProtectedLayout;
