import { ReactNode, useEffect } from "react";
import { Footer } from "../common";
import { HeaderDesktop } from "../common/Header/header-desktop";
import dynamic from "next/dynamic";
import { LayoutWithChatBox } from "./layout-with-chatbox";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <LayoutWithChatBox>
      <div className="flex drawer flex-col min-h-[100vh]">
        <HeaderDesktop />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LayoutWithChatBox>
  );
}
