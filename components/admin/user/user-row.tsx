import { ConfirmModal, Menus, Modal } from "@/components/common";
import { Checkbox } from "@/components/common/checkbox";
import Table from "@/components/common/table";
import { User } from "@/types";
import { formatDate } from "@/utils";
import * as React from "react";

export interface IUserRowProps {
  user: User & {
    checked: boolean;
  };
  handleActiveUser: (id: string) => void;
  handleInActiveUser: (id: string) => void;
}

export function UserRow({
  user,
  handleActiveUser,
  handleInActiveUser,
}: IUserRowProps) {
  return (
    <Table.Row>
      <div className="flex gap-x-2">{user.fullName}</div>
      <div>{user.email}</div>
      <div>{user.role}</div>
      <div>
        {user.active ? (
          <span className="text-grey-0 bg-green-50 rounded-xl px-1 text-sm">
            Active
          </span>
        ) : (
          <span className="text-grey-0 bg-red-200 rounded-xl px-1 text-sm">
            Inactive
          </span>
        )}
      </div>

      <div>{formatDate(user.createdAt)}</div>
      <Menus.Menu>
        <Menus.Toggle id={user._id} />
        <Menus.List id={user._id}>
          {!user.active && (
            <Modal.Open opens={`active-${user._id}`}>
              <Menus.Button
                icon={
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
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              >
                Active
              </Menus.Button>
            </Modal.Open>
          )}
          {user.active && (
            <Modal.Open opens={`inactive-${user._id}`}>
              <Menus.Button
                icon={
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
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              >
                Inactive
              </Menus.Button>
            </Modal.Open>
          )}
        </Menus.List>
        <Modal.Window name={`active-${user._id}`}>
          <ConfirmModal
            label="Xác nhận active người dùng"
            onConfirm={() => handleActiveUser(user._id)}
          />
        </Modal.Window>
        <Modal.Window name={`inactive-${user._id}`}>
          <ConfirmModal
            label="Xác nhận inactive người dùng"
            onConfirm={() => handleInActiveUser(user._id)}
          />
        </Modal.Window>
      </Menus.Menu>
    </Table.Row>
  );
}
