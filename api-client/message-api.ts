import { ResponseMessage } from "@/types";
import { SuccessResponseApi } from "@/types/common.types";
import axiosClient from "./axios-client";

export const messageApi = {
  addText(body: {
    content: string;
    receiverId: string;
  }): Promise<SuccessResponseApi<string>> {
    return axiosClient.post("/message/add-text", body);
  },
  getList(params: {
    conversationId: string;
  }): Promise<SuccessResponseApi<ResponseMessage>> {
    return axiosClient.get("/message", { params });
  },
};
