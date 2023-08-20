import { SuccessResponseApi } from "@/types/common.types";
import axiosClient from "./axios-client";
import { Order, Pagination, ReviewOrder } from "@/types";
import { ParsedUrlQuery } from "querystring";
import { Url } from "url";

export const checkoutApi = {
  checkoutReview(body: {
    cartId: string;
    shop_order_ids: {
      shopId: string;
      items_products: { price: number; quantity: number; productId: string }[];
    }[];
  }): Promise<SuccessResponseApi<ReviewOrder>> {
    return axiosClient.post("/checkout/review", body);
  },
  order(body: {
    cartId: string;
    shop_order_ids: {
      shopId: string;
      items_products: { price: number; quantity: number; productId: string }[];
    }[];
  }): Promise<SuccessResponseApi<number>> {
    return axiosClient.post("/checkout", body);
  },
  getOrdersByUser(
    params: ParsedUrlQuery
  ): Promise<SuccessResponseApi<Order[]>> {
    return axiosClient.get("/checkout", { params });
  },
  getOrderDetailByUser(id: string): Promise<SuccessResponseApi<Order>> {
    return axiosClient.get(`/checkout/${id}`);
  },
  getOrdersByShop(
    params: ParsedUrlQuery
  ): Promise<SuccessResponseApi<{ orders: Order[]; pagination: Pagination }>> {
    return axiosClient.get("/checkout/shop/get-all", { params });
  },
  confirmOrderByShop(id: string): Promise<SuccessResponseApi<number>> {
    return axiosClient.post(`/checkout/shop/confirm/${id}`);
  },
  shipOrderByShop(id: string): Promise<SuccessResponseApi<number>> {
    return axiosClient.post(`/checkout/shop/shipped/${id}`);
  },
  deliveredOrderByShop(id: string): Promise<SuccessResponseApi<number>> {
    return axiosClient.post(`/checkout/shop/delivered/${id}`);
  },
  cancelOrderByShop(
    id: string,
    body: { userId: string }
  ): Promise<SuccessResponseApi<number>> {
    return axiosClient.post(`/checkout/shop/cancelled/${id}`, body);
  },
  cancelOrderByUser(id: string): Promise<SuccessResponseApi<number>> {
    return axiosClient.post(`/checkout/cancelled/${id}`);
  },
  createPaymentUrl(body: {
    amount: number;
    bankCode: string;
    language: string;
  }): Promise<SuccessResponseApi<Url>> {
    return axiosClient.post(`/checkout/create_payment_url`, body);
  },
  vnpayReturn(params: ParsedUrlQuery): Promise<SuccessResponseApi<number>> {
    return axiosClient.get(`/checkout/vnpay_return`, { params });
  },
};
