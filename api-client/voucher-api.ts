import { ParsedUrlQuery } from "querystring";
import axiosClient from "./axios-client";
import {
  Pagination,
  SuccessResponseApi,
  PayloadAddVoucher,
  Voucher,
} from "@/types";

export const voucherApi = {
  getVoucherForUser(params: {
    shopId: string;
  }): Promise<SuccessResponseApi<Voucher[]>> {
    return axiosClient.get("/voucher", { params });
  },
  getVoucherForShop(params: ParsedUrlQuery): Promise<
    SuccessResponseApi<{
      data: {
        codeRetentionTime: number;
        numUsed: number;
        status: "happenning" | "upcoming" | "finished";
        voucher_max_uses: number;
        voucher_name: string;
        voucher_value: number;
        _id: string;
      }[];
      pagination: Pagination;
    }>
  > {
    return axiosClient.get("/voucher/shop", { params });
  },
  getDetailVoucher(id: string): Promise<SuccessResponseApi<Voucher>> {
    return axiosClient.get(`/voucher/${id}`);
  },
  deleteVoucher(id: string) {
    return axiosClient.delete(`/voucher/${id}`);
  },
  updateVoucher({
    id,
    body,
  }: {
    id: string;
    body: Pick<
      Voucher,
      | "voucher_code"
      | "voucher_end_date"
      | "voucher_name"
      | "voucher_value"
      | "voucher_min_order_value"
      | "voucher_start_date"
      | "voucher_max_uses"
      | "voucher_max_uses_per_user"
    >;
  }): Promise<SuccessResponseApi<Voucher>> {
    return axiosClient.patch(`/voucher/${id}`, body);
  },
  applyVoucher(body: { voucherId: string }) {
    return axiosClient.post("/voucher/apply", body);
  },
  addVoucher(body: Omit<PayloadAddVoucher, "_id">) {
    return axiosClient.post("/voucher", body);
  },
};
