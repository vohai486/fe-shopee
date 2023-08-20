import { Review } from "@/types";
import { SuccessResponseApi } from "@/types/common.types";
import axiosServer from "./axios-server";

export const reviewApi = {
  getByUser(productId: string): Promise<SuccessResponseApi<Review[]>> {
    return axiosServer.get("/review", { params: { productId } });
  },
};
