import { LoginPayload, SignupPayload, User } from "@/types";
import { SuccessResponseApi } from "@/types/common.types";
import axiosClient from "./axios-client";

export const authApi = {
  signup(payload: SignupPayload): Promise<SuccessResponseApi<User>> {
    return axiosClient.post("/signup", payload);
  },
  login(payload: LoginPayload): Promise<SuccessResponseApi<User>> {
    return axiosClient.post("/login", payload);
  },
  logout(): Promise<SuccessResponseApi<null>> {
    return axiosClient.post("/logout");
  },
};

// {
//   user: User;
//   tokens: {
//     accessToken: string;
//     refreshToken: string;
//   };
// }
