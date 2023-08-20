import { authApi, userApi } from "@/api-client";
import { StorageKeys } from "@/constants";
import { LoginPayload } from "@/types";
import { getErrorMessage } from "@/utils/get-error-message";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isFetching, data, remove, isLoading, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      return userApi.getProfile();
    },
    keepPreviousData: true,
    staleTime: 60 * 60 * 1000,
    onSuccess: (data) => {
      if (data) {
        localStorage.setItem(StorageKeys.USER_ID, data.metadata._id);
        localStorage.setItem(StorageKeys.USER_INFO, data.metadata.fullName);
      }
    },
    onError: async () => {
      queryClient.setQueryData(["profile"], null);
      // logout();
    },
  });
  const profile = data?.metadata || null;
  const mutationLogin = useMutation({
    mutationFn: (payload: LoginPayload) => {
      return authApi.login(payload);
    },
  });
  const mutationLogout = useMutation({
    mutationFn: () => {
      return authApi.logout();
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["carts"] });
      queryClient.setQueryData(["profile"], null);

      localStorage.removeItem(StorageKeys.USER_INFO);
      localStorage.removeItem(StorageKeys.USER_ID);
    },
  });
  const login = async (values: LoginPayload) => {
    await mutationLogin.mutateAsync(values, {
      onSuccess: async (data) => {
        toast.success("login successfully");
        localStorage.setItem(StorageKeys.USER_ID, data.metadata._id);
        await refetch();
        router.push("/");
      },
      onError: (error) => {
        const message = getErrorMessage(error);
        toast.error(message);
      },
    });
  };
  const logout = async () => {
    mutationLogout.mutate();
  };
  return { login, logout, profile, isFetching, isLoading };
}
