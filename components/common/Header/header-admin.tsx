import { useAuth } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
export function HeaderAdmin() {
  const { profile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };
  return (
    <header className="border-box border bg-box shadow-sm-50 px-12 py-3 flex justify-end gap-x-6">
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
