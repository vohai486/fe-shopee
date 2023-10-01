import { ReactNode } from "react";
import { HeaderSeller } from "../common/Header/header-seller";
import { AuthSeller } from "../common/auth-seller";
import { Sidebar } from "../seller";
import { LayoutWithChatBox } from "./layout-with-chatbox";

export function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <AuthSeller>
      <LayoutWithChatBox>
        <div className="grid lg:grid-cols-[260px_1fr] grid-rows-[auto_1fr] drawer min-h-[100vh] h-screen">
          <HeaderSeller />
          <Sidebar />
          <main className="pt-10 px-12 pb-16 overflow-scroll">
            {/* <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-side xl:hidden z-30">
              <label htmlFor="my-drawer" className="drawer-overlay"></label>
              <div className=" bg-white w-[200px]   px-2 h-full">
                <Sidebar />
              </div>
            </div> */}
            <div className="flex gap-8 flex-col w-full">{children}</div>
          </main>
        </div>
      </LayoutWithChatBox>
    </AuthSeller>
  );
}
