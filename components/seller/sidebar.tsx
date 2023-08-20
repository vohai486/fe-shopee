import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

const options = [
  {
    url: "/seller/order",
    label: "quản lý đơn hàng",
  },
  {
    url: "/seller/product",
    label: "quản lý sản phẩm",
  },
  {
    url: "/seller/inventory",
    label: "quản lý tồn kho",
  },
  {
    url: "/seller/voucher",
    label: "quản lý voucher",
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
