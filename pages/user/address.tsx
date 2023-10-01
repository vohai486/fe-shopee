import { userApi } from "@/api-client";
import { ConfirmModal, Modal } from "@/components/common";
import { UserProfileLayout } from "@/components/layouts";
import { AddAddress, FormAddressUser } from "@/components/user";
import { Address } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";

export default function AddressPage() {
  const [showForm, setShowForm] = React.useState(false);
  const [currentAddress, setCurrentAddress] = React.useState<Address>(
    {} as Address
  );
  const onClose = () => {
    setCurrentAddress({} as Address);
    setShowForm(false);
  };

  const { data, refetch } = useQuery({
    queryKey: ["address"],
    queryFn: userApi.getAddress,
    staleTime: 3 * 60 * 1000,
  });

  const setDefaultMutation = useMutation({
    mutationFn: userApi.setAsDefault,
    onSuccess: () => {
      refetch();
    },
  });
  const deleteAddressMutation = useMutation({
    mutationFn: userApi.deleteAddress,
    onSuccess: () => {
      refetch();
    },
  });
  const handeDelete = (id: string) => {
    deleteAddressMutation.mutate(id);
  };
  const handeSetDefault = (id: string) => {
    setDefaultMutation.mutate(id);
  };
  return (
    <div className="text-sm  border border-box bg-box rounded-md">
      <div className="py-5 lg:px-7 px-4 flex w400:flex-row flex-col w400:justify-between gap-y-2 w400:items-center border-b border-box">
        <h1 className="text-lg font-medium text-title">Địa chỉ của tôi</h1>
        <AddAddress />
      </div>
      <div className="lg:px-7 px-4">
        {data?.metadata.map((address, idx) => (
          <div
            key={address._id}
            className="[&:not(:last-child)]:border-b border-box"
          >
            <div className="py-4">
              <div className="flex justify-between items-center mb-1">
                <div className="flex w400:flex-row flex-col gap-x-2 text-title w400:items-center">
                  <div className="text-base">{address.fullName}</div>
                  <div className=" hidden w400:block">|</div>
                  <div>{address.phoneNumber}</div>
                </div>
                <Modal>
                  <div className="flex w400:flex-row flex-col gap-x-2">
                    <Modal.Open opens={`del-${address._id}`}>
                      <button className=" text-red-100">Xóa</button>
                    </Modal.Open>

                    <Modal.Open opens={`update-${address._id}`}>
                      <button
                        className="text-blue-200"
                        onClick={() => {
                          setCurrentAddress(address);
                          setShowForm(true);
                        }}
                      >
                        Cập nhật
                      </button>
                    </Modal.Open>
                    <Modal.Window name={`update-${address._id}`}>
                      <FormAddressUser address={address} />
                    </Modal.Window>
                    <Modal.Window name={`del-${address._id}`}>
                      <ConfirmModal
                        label="Xác nhận xóa địa chỉ?"
                        onConfirm={() => handeDelete(address._id)}
                        isLoading={deleteAddressMutation.isLoading}
                      />
                    </Modal.Window>
                  </div>
                </Modal>
              </div>
              <div className="flex sm:flex-row flex-col items-start sm:justify-between gap-x-2 sm:items-center">
                <div>
                  <div>{address.street}</div>
                  <div>
                    {address.ward}, {address.district}, {address.city}
                  </div>
                </div>
                {!address.default && (
                  <button
                    onClick={() => handeSetDefault(address._id)}
                    className="px-3 mt-2 sm:mt-0 py-1 dark:text-grey-0 text-black-100 border border-black-100 dark:border-grey-0"
                  >
                    Thiết lập mặc định
                  </button>
                )}
              </div>
              {address.default && (
                <button className="border  border-blue-200 text-blue-200 mt-2 px-1">
                  Mặc định
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
AddressPage.Layout = UserProfileLayout;
