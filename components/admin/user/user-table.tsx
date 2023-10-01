import { Menus, Modal, Pagination, Spinner } from "@/components/common";
import { Checkbox } from "@/components/common/checkbox";
import Table from "@/components/common/table";
import { useRouter } from "next/router";
import { UserRow } from "./user-row";
import { User } from "@/types";
import { useEffect, useState } from "react";
import { userApi } from "@/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export function UserTable() {
  const { query } = useRouter();
  const [listUser, setListUser] = useState<
    (User & {
      checked: boolean;
    })[]
  >([]);
  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: ["admin-user", query],
    queryFn: () => userApi.getAll(query),
    staleTime: 30,
  });
  useEffect(() => {
    if (!data?.metadata) return;
    setListUser(
      () =>
        data?.metadata.users.map((user) => ({
          ...user,
          checked: false,
        })) || []
    );
  }, [data]);

  const mutationActive = useMutation({
    mutationFn: userApi.activeUser,
    onSuccess: () => {
      refetch();
    },
  });
  const mutationInActive = useMutation({
    mutationFn: userApi.inAcctiveUser,
    onSuccess: () => {
      refetch();
    },
  });
  const handleActiveUser = (id: string) => mutationActive.mutate(id);
  const handleInActiveUser = (id: string) => mutationInActive.mutate(id);

  const { page, total_pages } = data?.metadata.pagination || {};
  if (isLoading || isFetching) {
    return <Spinner />;
  }
  return (
    <Modal>
      <Menus>
        <div className="flex flex-col gap-4">
          <Table columns="2fr 2fr .5fr 1fr 2fr 1rem">
            <Table.Header>
              <div>Họ tên</div>
              <div>Email</div>
              <div>Role</div>
              <div>Trạng thái</div>
              <div>Ngày tạo</div>
              <div></div>
            </Table.Header>
            <Table.Body
              isLoading={isLoading || isFetching}
              data={listUser || []}
              render={(user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  handleActiveUser={handleActiveUser}
                  handleInActiveUser={handleInActiveUser}

                  // handleChecked={handleChecked}
                  // handleActive={handleActive}
                  // handleInActive={handleInActive}
                />
              )}
            ></Table.Body>
            {total_pages && total_pages > 1 ? (
              <Table.Footer>
                <Pagination page={page || 1} total_pages={total_pages || 1}>
                  <Pagination.Maxi />
                </Pagination>
              </Table.Footer>
            ) : null}
          </Table>
        </div>
      </Menus>
    </Modal>
  );
}
