import { SuccessResponseApi } from "@/types/common.types";
import axiosServer from "./axios-server";
import { Pagination, Product, ProductSelect } from "@/types";
import { ParsedUrlQuery } from "querystring";

export const productApi = {
  getAll(
    params: ParsedUrlQuery,
    signal?: AbortSignal
  ): Promise<
    SuccessResponseApi<{
      products: ProductSelect[];
      pagination: Pagination;
    }>
  > {
    return axiosServer.get("/product", { params, signal });
  },
  getDetail(id: string): Promise<SuccessResponseApi<Product>> {
    return axiosServer.get(`/product/${id}`);
  },
};
