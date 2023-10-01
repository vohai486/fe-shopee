import React, { ReactNode } from "react";
import { AuthAdmin } from "../common";
import { HeaderAdmin } from "../common/Header/header-admin";
import { Sidebar } from "../admin";
import { LayoutWithChatBox } from "./layout-with-chatbox";

export interface IAdminLayoutProps {}

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthAdmin>
      <LayoutWithChatBox>
        <div className="grid lg:grid-cols-[260px_1fr] grid-rows-[auto_1fr] drawer min-h-[100vh] h-screen">
          <HeaderAdmin />
          <Sidebar />
          <main className="pt-10 px-12 pb-16 overflow-scroll">
            <div className="flex gap-8 flex-col w-full">{children}</div>
          </main>
        </div>
      </LayoutWithChatBox>
    </AuthAdmin>
  );
}
