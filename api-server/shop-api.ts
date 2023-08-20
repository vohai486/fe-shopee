import { ShopResponse } from "@/types";
import { SuccessResponseApi } from "@/types/common.types";
import axiosServer from "./axios-server";

export const shopApi = {
  getAll(): Promise<
    SuccessResponseApi<
      {
        shop_name: string;
        _id: string;
      }[]
    >
  > {
    return axiosServer.get("/shop");
  },
  getDetailShop(id: string): Promise<SuccessResponseApi<ShopResponse>> {
    return axiosServer.get(`/shop/${id}`);
  },
};
