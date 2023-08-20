import { SuccessResponseApi } from "@/types/common.types";
import axiosServer from "./axios-server";
import { Category } from "@/types";

export const categoryApi = {
  getAll(): Promise<SuccessResponseApi<Category[]>> {
    return axiosServer.get("/category");
  },
};
