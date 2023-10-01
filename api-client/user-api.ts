import { SuccessResponseApi } from "@/types/common.types";
import axiosClient from "./axios-client";
import { Address, Pagination, User } from "@/types";
import { ParsedUrlQuery } from "querystring";

export const userApi = {
  getProfile(): Promise<SuccessResponseApi<User>> {
    return axiosClient.get("/user/get-profile");
  },
  updateMe(body: {
    date_of_birth: Date;
    email: string;
    fullName: string;
    gender: number;
    phoneNumber: string;
  }): Promise<SuccessResponseApi<User>> {
    return axiosClient.patch("/user/me/update", body);
  },
  uploadAvatar(data: FormData) {
    return axiosClient.post("/user/upload-avatar", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  addAddress(data: Omit<Address, "_id">): Promise<SuccessResponseApi<number>> {
    return axiosClient.post("/user/address/add", data);
  },
  getAddress(): Promise<SuccessResponseApi<Address[]>> {
    return axiosClient.get("/user/address/all");
  },
  setAsDefault(id: string): Promise<SuccessResponseApi<number>> {
    return axiosClient.post(`/user/address/${id}`);
  },
  deleteAddress(id: string): Promise<SuccessResponseApi<number>> {
    return axiosClient.delete(`/user/address/${id}`);
  },
  updateAddress({
    id,
    data,
  }: {
    id: string;
    data: Omit<Address, "_id">;
  }): Promise<SuccessResponseApi<number>> {
    return axiosClient.patch(`/user/address/${id}`, { ...data });
  },
  followShop(body: { shopId: string }): Promise<SuccessResponseApi<number>> {
    return axiosClient.post("/user/follow-shop", body);
  },
  unFollowShop(body: { shopId: string }): Promise<SuccessResponseApi<number>> {
    return axiosClient.post("/user/unfollow-shop", body);
  },
  checkAdmin(): Promise<SuccessResponseApi<{ id: string }>> {
    return axiosClient.post("/user/check-admin");
  },
  getAll(
    params: ParsedUrlQuery
  ): Promise<SuccessResponseApi<{ users: User[]; pagination: Pagination }>> {
    return axiosClient.get("/user", { params });
  },
  activeUser(id: string): Promise<number> {
    return axiosClient.post(`/user/active/${id}`);
  },
  inAcctiveUser(id: string): Promise<number> {
    return axiosClient.post(`/user/in-active/${id}`);
  },
};
