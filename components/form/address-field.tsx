import { addressApi } from "@/api-client";
import { useClickOutSide } from "@/hooks";
import { Address, City, District, Ward } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { Control, UseFormGetValues, UseFormSetValue } from "react-hook-form";

export interface AddressFieldProps {
  error: boolean;
  getValueForm: (name: string) => string | number | boolean | undefined;
  setValueForm: (name: string, value: any) => void;
}

export function AddressField({
  error,
  setValueForm,
  getValueForm,
}: AddressFieldProps) {
  const [show, setShow] = useState(false);
  const [type, setType] = useState<"city" | "district" | "ward">("city");
  const [codeCity, setCodeCity] = useState<number>();
  const [codeDistrict, setCodeDistrict] = useState<number>();
  const divRef = useRef<HTMLDivElement>(null);
  useClickOutSide(divRef, () => setShow(false));
  const { data: listCity } = useQuery({
    queryKey: ["city"],
    queryFn: addressApi.getCity,
    staleTime: 3 * 60 * 1000,
  });
  const { data: listDistrict } = useQuery({
    queryKey: ["district", codeCity],
    queryFn: () => addressApi.getDistrict({ province_id: codeCity || 0 }),
    staleTime: 3 * 60 * 1000,
    enabled: !!codeCity,
  });
  const { data: listWard } = useQuery({
    queryKey: ["ward", codeDistrict],
    queryFn: () => addressApi.getWard({ district_id: codeDistrict || 0 }),
    staleTime: 3 * 60 * 1000,
    enabled: !!codeDistrict,
  });
  const handleChange = (name: string, value: number) => {
    setValueForm(type, name);
    if (type === "city") {
      setValueForm("codeCity", value);
      setValueForm("codeDistrict", 0);
      setValueForm("codeWard", 0);
      setValueForm("district", "");
      setValueForm("ward", "");

      setCodeCity(value);
      setType("district");
    }
    if (type === "district") {
      setValueForm("codeDistrict", value);
      setValueForm("ward", "");
      setValueForm("codeWard", 0);

      setCodeDistrict(value);
      setType("ward");
    }
    if (type === "ward") {
      setValueForm("ward", name);
      setValueForm("codeWard", value);

      setShow(false);
      setType("city");
    }
  };
  return (
    <div ref={divRef} className="relative h-10">
      <span
        className={`absolute  z-10 bottom-3/4  bg-white text-gray2 sm:top-[-10px] left-2 ${
          error && "text-red"
        }`}
      >
        Tỉnh/ Thành Phố, Quận/Huyện, Phường/Xã
      </span>
      <div
        onClick={() => setShow(true)}
        className={`absolute inset-0 border border-gray3 px-3 py-2 outline-none rounded-sm focus:border-orange ${
          error && "border-red focus:border-red"
        }`}
      >
        <p className=" line-clamp-1">
          {(getValueForm("city") as string) +
            (getValueForm("district") && ", " + getValueForm("district")) +
            (getValueForm("ward") && ", " + getValueForm("ward"))}
        </p>
      </div>
      {show && (
        <div className="absolute top-[calc(100%+2px)] border-gray3 rounded-sm border bg-white w-full">
          <div className="w-full flex justify-between text-gray4 py-4 border-b border-gray3">
            <div
              onClick={() => setType("city")}
              className={`px-3 text-center w-full h-full cursor-pointer ${
                type === "city" && "text-orange"
              }`}
            >
              Tỉnh/Thành phố
            </div>
            <div
              onClick={() => setType("district")}
              className={`px-3 text-center w-full h-full cursor-pointer ${
                type === "district" && "text-orange"
              }`}
            >
              Quận/Huyện
            </div>
            <div
              onClick={() => setType("ward")}
              className={`px-3 text-center w-full h-full cursor-pointer ${
                type === "ward" && "text-orange"
              }`}
            >
              Phường/Xã
            </div>
          </div>
          <div className=" max-h-[200px] overflow-auto">
            <SelectAddress
              handleChange={handleChange}
              data={
                (type === "city"
                  ? listCity?.data.data
                  : type === "district"
                  ? listDistrict?.data.data
                  : listWard?.data.data) || []
              }
              type={type}
            ></SelectAddress>
          </div>
        </div>
      )}
    </div>
  );
}

const SelectAddress = <T extends (City | District | Ward)[]>({
  data,
  type,
  handleChange,
}: {
  data: T;
  type: "city" | "district" | "ward";
  handleChange: (name: string, value: number) => void;
}) => {
  if (data.length === 0) return;
  return (
    <div className="cursor-pointer">
      {data.length > 0 &&
        data.map((item) => {
          const name =
            type === "city"
              ? (item as City).ProvinceName
              : type === "district"
              ? (item as District).DistrictName
              : (item as Ward).WardName;

          const code =
            type === "city"
              ? (item as City).ProvinceID
              : type === "district"
              ? (item as District).DistrictID
              : (item as Ward).WardCode;
          return (
            <div
              onClick={() => handleChange(name, +code)}
              key={code}
              className="px-3 py-2 hover:bg-gray1"
            >
              {name}
            </div>
          );
        })}
    </div>
  );
};
