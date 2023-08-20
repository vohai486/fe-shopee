import { SuccessResponseApi } from "@/types/common.types";
import axiosClient from "./axios-client";
import { ParsedUrlQuery } from "querystring";
import { Address, ShopResponse } from "@/types";

export const shopApi = {
  checkShop(): Promise<SuccessResponseApi<{ name: string; id: string }>> {
    return axiosClient.post("/shop/check-shop");
  },
  getDetailShop(id: string): Promise<SuccessResponseApi<ShopResponse>> {
    return axiosClient.get(`/shop/${id}`);
  },
  registerSeller(body: {
    name: string;
    address: Omit<Address, "_id" | "type" | "default">;
  }): Promise<SuccessResponseApi<ShopResponse>> {
    return axiosClient.post(`/shop/register-seller`, body);
  },
};
