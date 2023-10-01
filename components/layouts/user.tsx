import { ReactNode } from "react";
import { AuthUser, Footer } from "../common";
import { HeaderDesktop } from "../common/Header/header-desktop";
import { Sidebar } from "../user";
import { LayoutWithChatBox } from "./layout-with-chatbox";

export function UserProfileLayout({ children }: { children: ReactNode }) {
  return (
    <AuthUser>
      <LayoutWithChatBox>
        <div className="flex flex-col min-h-[100vh]">
          <HeaderDesktop />
          <main className="flex-1 py-6">
            <div className="container drawer-content">
              <div className="flex lg:flex-row flex-col">
                <div className="shrink-0 w-full hidden  lg:block lg:w-[200px] lg:pr-5 lg:pl-0 px-2">
                  <Sidebar />
                </div>
                <div className="w-full overflow-x-auto">{children}</div>
              </div>
            </div>
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-side lg:hidden">
              <label
                htmlFor="my-drawer"
                className="drawer-overlay bg-backdrop-color dark:bg-backdrop-color-dark"
              ></label>
              <div className=" bg-box border-box w-[200px] px-2 h-full">
                <Sidebar />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </LayoutWithChatBox>
    </AuthUser>
  );
}
