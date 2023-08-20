import { SuccessResponseApi } from "@/types/common.types";
import axiosClient from "./axios-client";
import { Category } from "@/types";

export const categoryApi = {
  getAll(): Promise<SuccessResponseApi<Category[]>> {
    return axiosClient.get("/category");
  },
};
