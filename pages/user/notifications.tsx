import { UserProfileLayout } from "@/components/layouts";
import { useNotification } from "@/hooks";
import Link from "next/link";

export default function NotificationsPage() {
  const { listNotify, handleMarkReadAllNotify, handleMarkReadNotify } =
    useNotification("user");
  return (
    <div className="text-sm border border-box rounded-md">
      <div className="text-right border-box border-bottom  bg-box p-2">
        <span
          onClick={handleMarkReadAllNotify}
          className="hover:text-blue-200 text-title cursor-pointer"
        >
          Đánh dấu đã đọc tất cả
        </span>
      </div>
      {listNotify.map((notify) => (
        <Link
          href={`/user/purchase/${notify.noti_options.orderId}`}
          className={`p-4 cursor-pointer block text-black-100 dark:text-grey-300 hover:bg-blue-200 dark:hover:bg-blue-200   ${
            !notify.noti_isRead ? " bg-box" : "bg-grey-400 dark:bg-blue-600"
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
