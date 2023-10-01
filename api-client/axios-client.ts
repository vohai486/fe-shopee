import { Headers, StorageKeys } from "@/constants";
import axios, { AxiosError } from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
axiosClient.interceptors.request.use(
  function (config) {
    config.headers[Headers.CLIENT_ID] =
      localStorage.getItem(StorageKeys.USER_ID) || "";
    // config.headers[Headers.AUTHORIZATION] =
    //   localStorage.getItem("access_token") || "";
    // config.headers[Headers.REFRESH_TOKEN] =
    //   localStorage.getItem("refresh_token") || "";
    return config;
  },
  function (error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    return Promise.reject(error);
  }
);
// axiosClient.interceptors.request.use(
//   function () {
//     // config.signal = signal
//     config.headers['Authorization'] =
//       'Bearer ' +
//       (localStorage.getItem(StorageKeys.TOKEN)
//         ? localStorage.getItem(StorageKeys.TOKEN)
//         : '')
//     return config
//   },
//   function (error) {
//     return Promise.reject(error)
//   }
// )
// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const data: any | undefined = error.response?.data;
    const message = data?.message || error.message;
    return Promise.reject(message);
  }
);
export default axiosClient;
