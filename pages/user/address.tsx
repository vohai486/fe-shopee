import { userApi } from "@/api-client";
import { UserProfileLayout } from "@/components/layouts";
import { FormAddressUser } from "@/components/user";
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
    <div className="text-sm bg-white border border-gray1 rounded-sm">
      {showForm && (
        <FormAddressUser address={currentAddress || {}} onClose={onClose} />
      )}
      <div className="py-5 lg:px-7 px-4 flex w400:flex-row flex-col w400:justify-between gap-y-2 w400:items-center border-b border-gray1">
        <h1 className="text-lg font-medium">Địa chỉ của tôi</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex h-10 w-44 items-center rounded-sm gap-x-2 bg-orange justify-center text-white"
        >
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Thêm địa chỉ mới
        </button>
      </div>
      <div className="lg:px-7 px-4 pt-3">
        <div className="text-lg mb-2">Địa chỉ</div>
        {data?.metadata.map((address, idx) => (
          <div key={address._id}>
            {idx !== 0 && <div className="w-full h-[1px] bg-gray1"></div>}
            <div className="py-4">
              <div className="flex justify-between items-center mb-1">
                <div className="flex w400:flex-row flex-col gap-x-2 w400:items-center">
                  <div className="text-base">{address.fullName}</div>{" "}
                  <div className="text-gray4 hidden w400:block">|</div>{" "}
                  <div className="text-gray4">{address.phoneNumber}</div>
                </div>
                <div className="flex w400:flex-row flex-col gap-x-2">
                  <button
                    className="text-blue"
                    onClick={() => {
                      setCurrentAddress(address);
                      setShowForm(true);
                    }}
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={() => handeDelete(address._id)}
                    className="text-blue"
                  >
                    Xóa
                  </button>
                </div>
              </div>
              <div className="flex sm:flex-row flex-col items-start sm:justify-between gap-x-2 sm:items-center">
                <div>
                  <div className="text-gray4">{address.street}</div>
                  <div className="text-gray4">
                    {address.ward}, {address.district}, {address.city}
                  </div>
                </div>
                {!address.default && (
                  <button
                    onClick={() => handeSetDefault(address._id)}
                    className="px-3 mt-2 sm:mt-0 py-1 border border-gray1 text-gray2 "
                  >
                    Thiết lập mặc định
                  </button>
                )}
              </div>
              {address.default && (
                <button className="border border-orange text-orange mt-2 px-1">
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
