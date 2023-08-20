import axios, { AxiosError } from "axios";

const axiosServer = axios.create({
  baseURL: `${process.env.API_URL}/v1/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add a response interceptor
axiosServer.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error.response?.data);
  }
);
export default axiosServer;
