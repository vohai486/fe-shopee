import { Conversation } from "@/types";
import { SuccessResponseApi } from "@/types/common.types";
import axiosClient from "./axios-client";

export const conversationApi = {
  getList(): Promise<SuccessResponseApi<Conversation[]>> {
    return axiosClient.get("/conversation");
  },
};
