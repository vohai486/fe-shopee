import { useAuth } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
const optionsSidebar = [
  {
    href: "/user/profile",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
    label: "Hồ sơ",
  },
  {
    href: "/user/address",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>
    ),
    label: "Địa chỉ",
  },
  {
    href: "/user/notifications",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
    ),
    label: "Thông Báo",
  },
  {
    href: "/user/purchase",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    ),
    label: "Đơn Mua",
  },
];

export function Sidebar() {
  const router = useRouter();
  const { profile } = useAuth();
  return (
    <div className="flex flex-col  justify-between">
      <div className="py-4 shrink-0 border-b border-box flex items-center gap-x-2">
        <div className="w-12 h-12 shrink-0 rounded-full border overflow-hidden border-box bg-box bg-grey-700 flex items-center justify-center">
          {profile?.avatar ? (
            <Image
              width={200}
              height={200}
              src={profile.avatar}
              alt=""
              style={{
                width: "100%",
              }}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 dark:stroke-grey-0-dark"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          )}
        </div>
        <div className="text-sm">
          <div>Tài khoản của</div>
          <div className="font-bold">{profile?.fullName}</div>
        </div>
      </div>
      <div className="flex flex-col cursor-pointer mt-3 custom-scrollbar  ">
        {optionsSidebar.map((option) => (
          <Link
            href={option.href}
            key={option.label}
            className={`py-2 min-w-[160px]  justify-normal flex items-center  gap-x-3  ${
              router.pathname === option.href
                ? "text-blue-200 font-semibold"
                : "text-blue-50"
            }`}
          >
            {option.icon}
            <span>{option.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
