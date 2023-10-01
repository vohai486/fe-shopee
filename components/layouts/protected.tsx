import { ReactNode } from "react";
import { Footer } from "../common";
import { HeaderDesktop } from "../common/Header/header-desktop";
import { AuthUser } from "../common/auth-user";
import { LayoutWithChatBox } from "./layout-with-chatbox";

export function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthUser>
      <LayoutWithChatBox>
        <div className="flex flex-col min-h-[100vh]">
          <HeaderDesktop />
          <main className="flex-1 container py-6">{children}</main>
          <Footer />
        </div>
      </LayoutWithChatBox>
    </AuthUser>
  );
}
