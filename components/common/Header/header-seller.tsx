import { useAuth, useNotification } from "@/hooks";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
const DarkModeToggle = dynamic(() => import("../dark-mode-toggle"), {
  ssr: false,
});
export function HeaderSeller() {
  const { profile, logout } = useAuth();
  const {
    listNotify,
    numberIsNotRead,
    handleMarkReadAllNotify,
    handleMarkReadNotify,
  } = useNotification("shop");

  const handleLogout = async () => {
    await logout();
  };
  return (
    <header className="border-box border bg-box shadow-sm-50 px-12 py-3 flex justify-end gap-x-6">
      <DarkModeToggle />
      <div className="flex cursor-pointer items-center gap-x-3">
        <div className="group parent relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
          {listNotify.length > 0 && (
            <>
              <div className="absolute bg-brand-50  text-grey-0 bg-blue-200 text-xs -top-[5px] -right-[7px] rounded-full px-1 py-0 flex items-center justify-center">
                {numberIsNotRead}
              </div>
              <div className=" sm:block hidden absolute transition-all max-h-[300px] overflow-y-auto custom-scrollbar  h-0 group-hover:opacity-100 overflow-hidden  group-hover:h-[unset]  top-5 right-0 z-10">
                <div className=" border bg-box border-box  w-[280px] rounded-sm ">
                  <div className="p-3 text-blue-200 font-medium text-right">
                    <span onClick={handleMarkReadAllNotify}>
                      Đánh dấu đã đọc tất cả
                    </span>
                  </div>
                  {listNotify.map((notify) => (
                    <Link
                      key={notify._id}
                      href={`/seller/order/${notify.noti_options.orderId}`}
                      className={`py-3 px-4 border-t border-box block  hover:opacity-70 ${
                        !notify.noti_isRead
                          ? " bg-box"
                          : "bg-grey-400 dark:bg-blue-600"
                      }`}
                      onClick={() =>
                        !notify.noti_isRead && handleMarkReadNotify(notify._id)
                      }
                    >
                      {notify.noti_content}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex text-sm group parent items-end relative gap-x-1 cursor-pointer">
        <button onClick={handleLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        </button>
      </div>
      <label htmlFor="my-drawer" className="cursor-pointer xl:hidden">
        <svg
          className="swap-off sm:w-8 sm:h-8 w-7 h-7  fill-gray2"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 512 512"
        >
          <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
        </svg>
      </label>
    </header>
  );
}
