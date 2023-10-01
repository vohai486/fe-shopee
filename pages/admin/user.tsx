import { UserTable, UserTableOperations } from "@/components/admin";
import { AdminLayout } from "@/components/layouts";

export default function UserAdminPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-title font-semibold">Người dùng</h1>
        <UserTableOperations />
      </div>
      <UserTable />
    </>
  );
}
UserAdminPage.Layout = AdminLayout;
