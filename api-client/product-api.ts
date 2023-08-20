import { SuccessResponseApi } from "@/types/common.types";
import axiosClient from "./axios-client";
import { Pagination, Product, ProductSelect } from "@/types/product.types";
import { ParsedUrlQuery } from "querystring";
import axios from "axios";

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
    return axiosClient.get("/product", { params, signal });
  },
  getListSearch(keySearch: string): Promise<
    SuccessResponseApi<{
      products: ProductSelect[];
    }>
  > {
    return axiosClient.get(`/product/search/${keySearch}`);
  },
  getAllProductByShop(params: ParsedUrlQuery): Promise<
    SuccessResponseApi<{
      products: Product[];
      pagination: Pagination;
    }>
  > {
    return axiosClient.get(`/product/product-shop/all`, { params });
  },
  getAllProductByAdmin(params: ParsedUrlQuery): Promise<
    SuccessResponseApi<{
      products: Pick<
        Product,
        "createdAt" | "product_name" | "product_thumb" | "_id"
      >[];
      pagination: Pagination;
    }>
  > {
    return axiosClient.get(`/product/product-admin/all`, { params });
  },
  createProduct(data: FormData): Promise<SuccessResponseApi<number>> {
    return axiosClient.post("/product", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  publishProduct(ids: string[]): Promise<SuccessResponseApi<number>> {
    return axiosClient.post(`/product/publish`, { productIds: ids });
  },
  unPublishProduct(ids: string[]): Promise<SuccessResponseApi<number>> {
    return axiosClient.post(`/product/un-publish`, { productIds: ids });
  },
  verifyProduct(ids: string[]): Promise<SuccessResponseApi<number>> {
    return axiosClient.post("/product/verify-products", { productIds: ids });
  },
};
