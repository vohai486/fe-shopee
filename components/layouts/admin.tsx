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
        <div className="flex flex-col min-h-[100vh]">
          <HeaderAdmin />
          <main className="flex-1">
            <div className="bg-white fixed w-[220px] h-[100%] py-14 top-0 p-4">
              <Sidebar />
            </div>
            <div className="pl-[240px] py-20 pr-10">{children}</div>
          </main>
        </div>
      </LayoutWithChatBox>
    </AuthAdmin>
  );
}
