import { Notification } from "@/types";
import { SuccessResponseApi } from "@/types/common.types";
import axiosClient from "./axios-client";

export const notifyApi = {
  getNotifyByUser(): Promise<SuccessResponseApi<Notification[]>> {
    return axiosClient.get("/notification");
  },
  getNotifyByShop(): Promise<SuccessResponseApi<Notification[]>> {
    return axiosClient.get("/notification/shop");
  },
  markReadNotify(id: string): Promise<SuccessResponseApi<number>> {
    return axiosClient.post(`/notification/mark-read/${id}`);
  },
  markReadAllNotify(): Promise<SuccessResponseApi<number>> {
    return axiosClient.post(`/notification/mark-read-all`);
  },
};
