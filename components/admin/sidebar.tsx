import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

const options = [
  {
    url: "/admin/user",
    label: "quản lý người dùng",
  },
  {
    url: "/admin/shop",
    label: "quản lý shop",
  },
  {
    url: "/admin/product",
    label: "quản lý sản phẩm",
  },
];
export function Sidebar() {
  const { pathname } = useRouter();
  return (
    <div className="text-sm">
      {options.map((item) => (
        <Link
          href={item.url}
          className={`flex py-3 items-center uppercase text-gray4 font-bold gap-x-1 ${
            pathname === item.url && "text-orange font-bold"
          }`}
          key={item.url}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
