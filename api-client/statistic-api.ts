import { SuccessResponseApi } from "@/types/common.types";
import axiosClient from "./axios-client";

export const statisticApi = {
  getTodoList(): Promise<
    SuccessResponseApi<
      {
        status: string;
        count: number;
      }[]
    >
  > {
    return axiosClient.get("/stats");
  },
  getStatsOrder(params: {
    type: string;
    startDate?: Date;
    endDate?: Date;
    selectedDate?: Date;
    year?: number;
    status: "confirmed" | "booked" | "cancelled";
  }): Promise<
    SuccessResponseApi<
      { key: string; numberOfOrders: number; totalAmount: number }[]
    >
  > {
    return axiosClient.get("/stats/order", { params });
  },
};
