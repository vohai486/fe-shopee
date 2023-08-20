import { ReactNode } from "react";
import { HeaderSeller } from "../common/Header/header-seller";
import { AuthSeller } from "../common/auth-seller";

export function SellerPortalLayout({ children }: { children: ReactNode }) {
  return (
    <AuthSeller>
      <div className="flex flex-col min-h-[100vh]">
        <HeaderSeller />
        <main className="flex-1">
          <div className="py-4 container">{children}</div>
        </main>
      </div>
    </AuthSeller>
  );
}
