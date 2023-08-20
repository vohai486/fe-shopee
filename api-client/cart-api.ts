import { SuccessResponseApi } from "@/types/common.types";
import axiosClient from "./axios-client";
import { Category } from "@/types";
import { Cart } from "@/types/cart.types";

export const cartApi = {
  getCart(): Promise<SuccessResponseApi<Cart>> {
    return axiosClient.get("/cart");
  },
  addToCart(body: {
    productId: string;
    quantity: number;
  }): Promise<SuccessResponseApi<number>> {
    return axiosClient.post("/cart", body);
  },
  updateCart(body: {
    productId: string;
    quantity: number;
  }): Promise<SuccessResponseApi<number>> {
    return axiosClient.post("/cart/update", body);
  },
  deleteCart(body: {
    productIds: string[];
  }): Promise<SuccessResponseApi<number>> {
    return axiosClient.delete("/cart", { data: body });
  },
};
