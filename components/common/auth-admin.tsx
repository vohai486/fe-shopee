import { userApi } from "@/api-client";
import { useAuth } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

export interface AuthAdminProps {
  children: ReactNode;
}

export function AuthAdmin({ children }: AuthAdminProps) {
  const { push, back } = useRouter();
  const { profile, isLoading } = useAuth();
  const {
    data,
    isLoading: firstLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin", profile?._id],
    queryFn: () => userApi.checkAdmin(),
    enabled: !!profile?._id,
    staleTime: 30 * 60 * 1000,
  });
  useEffect(() => {
    if (!profile?._id && !isLoading) {
      push("/login");
    }
    if (!data?.metadata.id && !firstLoading) {
      back();
    }
  }, [data?.metadata.id, isLoading, profile?._id, push, back, firstLoading]);
  return <div>{children}</div>;
}
