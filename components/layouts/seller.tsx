import { ReactNode } from "react";
import { HeaderSeller } from "../common/Header/header-seller";
import { AuthSeller } from "../common/auth-seller";
import { Sidebar } from "../seller";
import { LayoutWithChatBox } from "./layout-with-chatbox";

export function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <AuthSeller>
      <LayoutWithChatBox>
        <div className="flex flex-col drawer min-h-[100vh]">
          <HeaderSeller />
          <main className="flex-1 mt-5">
            <div
              className={`bg-white fixed w-[220px] lg:block hidden  h-[100%] pt-10 z-10 p-4 shadow-lg `}
            >
              <Sidebar />
            </div>
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-side lg:hidden z-30">
              <label htmlFor="my-drawer" className="drawer-overlay"></label>
              <div className=" bg-white w-[200px]   px-2 h-full">
                <Sidebar />
              </div>
            </div>
            <div className="xl:pl-[240px] sm:py-14 py-20 px-0  lg:pl-5 lg:pr-5">
              {children}
            </div>
          </main>
        </div>
      </LayoutWithChatBox>
    </AuthSeller>
  );
}
