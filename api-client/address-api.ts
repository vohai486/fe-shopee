import { City, District, Ward } from "@/types";
import axios from "axios";
const URL = "https://online-gateway.ghn.vn/shiip/public-api/";
const TOKEN = "c65a38bf-b468-11ed-b190-ea4934f9883e";

interface SuccessResponse<T> {
  code: number;
  message: string;
  data: {
    data: T;
  };
}
const axiosClient = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
axiosClient.interceptors.request.use(
  function (config) {
    // config.signal = signal
    config.headers["token"] = TOKEN;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export const addressApi = {
  getCity(): Promise<SuccessResponse<City[]>> {
    return axiosClient.get(`master-data/province`);
  },
  getDistrict(body: {
    province_id: number;
  }): Promise<SuccessResponse<District[]>> {
    return axiosClient.get(`master-data/district`, {
      params: {
        ...body,
      },
    });
  },
  getWard(body: { district_id: number }): Promise<SuccessResponse<Ward[]>> {
    return axiosClient.get(`master-data/ward`, {
      params: {
        ...body,
      },
    });
  },
};
