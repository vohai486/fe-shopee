import { InventoryManage, Pagination } from "@/types";
import { SuccessResponseApi } from "@/types/common.types";
import axiosClient from "./axios-client";
import { ParsedUrlQuery } from "querystring";

export const inventoryApi = {
  manageInventory(params: ParsedUrlQuery): Promise<
    SuccessResponseApi<{
      inventories: InventoryManage[];
      pagination: Pagination;
    }>
  > {
    return axiosClient.get("/inventory", { params });
  },
  importProduct(body: {
    productId: string;
    quantity: number;
    price: number;
  }): Promise<SuccessResponseApi<number>> {
    return axiosClient.post("/inventory/import", body);
  },
};
