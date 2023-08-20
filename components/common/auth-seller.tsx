import { shopApi } from "@/api-client";
import { useAuth } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

export function AuthSeller({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { profile, isLoading } = useAuth();
  const {
    data,
    isLoading: firstLoading,
    refetch,
  } = useQuery({
    queryKey: ["shop", profile?._id],
    queryFn: () => shopApi.checkShop(),
    keepPreviousData: true,
    enabled: !!profile?._id,
    staleTime: 30 * 60 * 1000,
  });
  useEffect(() => {
    if (!profile?._id && !isLoading) {
      router.push("/login");
    }
    if (router.pathname === "/seller" && !data?.metadata.id && !firstLoading) {
      router.push("/seller/portal");
    }
    if (
      (router.pathname === "/seller/portal" ||
        router.pathname === "/seller/portal/form") &&
      data?.metadata.id &&
      !firstLoading
    ) {
      router.push("/seller");
    }
  }, [router, profile, isLoading, data?.metadata, firstLoading]);
  // if (isLoading) return <div>Loading</div>;
  return <>{children}</>;
}
