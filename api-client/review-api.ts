import { SuccessResponseApi } from "@/types/common.types";
import axiosClient from "./axios-client";
import { ParsedUrlQuery } from "querystring";
import { Address, Review, ShopResponse } from "@/types";

export const reviewApi = {
  create(data: FormData): Promise<SuccessResponseApi<number>> {
    return axiosClient.post("/review", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getReviewByShop(): Promise<SuccessResponseApi<Review[]>> {
    return axiosClient.get("/review/shop");
  },
};
