import { notifyApi } from "@/api-client/notify-api";
import { UserProfileLayout } from "@/components/layouts";
import { useAuth, useNotification } from "@/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import * as React from "react";

export default function NotificationsPage() {
  const { profile } = useAuth();
  const { listNotify, handleMarkReadAllNotify, handleMarkReadNotify } =
    useNotification("user");
  return (
    <div className="text-sm border border-gray1">
      <div className="text-right bg-white p-2">
        <span
          onClick={handleMarkReadAllNotify}
          className="hover:text-orange cursor-pointer"
        >
          Đánh dấu Đã đọc tất cả
        </span>
      </div>
      {listNotify.map((notify) => (
        <Link
          href={`/user/purchase/${notify.noti_options.orderId}`}
          className={`p-4 cursor-pointer block border-t hover:bg-gray1 border-gray1  ${
            !notify.noti_isRead ? "bg-gray" : "bg-white"
          }`}
          key={notify._id}
          onClick={() =>
            !notify.noti_isRead && handleMarkReadNotify(notify._id)
          }
        >
          {notify.noti_content}
        </Link>
      ))}
    </div>
  );
}
NotificationsPage.Layout = UserProfileLayout;
