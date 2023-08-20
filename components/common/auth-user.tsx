import { StorageKeys } from "@/constants";
import { useAuth } from "@/hooks";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";
import { Loading } from "./loading";

export interface IAuthProps {}

export function AuthUser({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { profile, isLoading, isFetching } = useAuth();
  useEffect(() => {
    if (!profile?._id && !isLoading) {
      router.push("/login");
    }
  }, [router, profile, isLoading]);
  if (isLoading || !profile?._id) {
    return <Loading />;
  }
  // if (isLoading) return <div>Loading</div>;
  return <>{children}</>;
}
