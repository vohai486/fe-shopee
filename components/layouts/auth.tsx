import { ReactNode, useEffect } from "react";
import { Footer } from "../common";
import { HeaderAuth } from "../common/Header/header-auth";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks";
export function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { profile, isLoading } = useAuth();
  useEffect(() => {
    if (profile?._id && !isLoading) {
      router.push("/");
    }
  }, [router, profile, isLoading]);
  return (
    <div className="flex flex-col min-h-[100vh]">
      <HeaderAuth />
      <main className="flex-1 flex justify-center items-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
