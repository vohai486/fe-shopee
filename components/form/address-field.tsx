import { addressApi } from "@/api-client";
import { useClickOutSide } from "@/hooks";
import { City, District, Ward } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

export interface AddressFieldProps {
  error: boolean;
  getValueForm: (name: string) => string | number | boolean | undefined;
  setValueForm: (name: string, value: any) => void;
  city: string;
  district: string;
  ward: string;
}

export function AddressField({
  error,
  setValueForm,
  getValueForm,
  city,
  district,
  ward,
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
        className={`absolute line-clamp-1 z-10 bottom-3/4  bg-box sm:top-[-10px] left-2 ${
          error && "text-red-100 dark:text-red-100"
        }`}
      >
        Tỉnh/ Thành Phố, Quận/Huyện, Phường/Xã
      </span>
      <div
        onClick={() => setShow(true)}
        className={`absolute inset-0 border px-3 py-2 outline-none focus:border-blue-200 rounded-md text-blue-700 bg-grey-0 dark:text-grey-300 dark:bg-blue-500 ${
          error ? "border-red-100 focus:border-red-100" : "border-box "
        }`}
      >
        <p className=" line-clamp-1">
          {getValueForm("city")
            ? (getValueForm("city") as string) +
              (getValueForm("district") && ", " + getValueForm("district")) +
              (getValueForm("ward") && ", " + getValueForm("ward"))
            : city + (district && ", " + district) + (ward && ", " + ward)}
        </p>
      </div>
      {show && (
        <div className="absolute z-10 top-[calc(100%+2px)] rounded-sm border border-box bg-box w-full">
          <div className="w-full flex justify-between text-gray4 py-4 border-b border-box">
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
              className="px-3 py-2 hover:text-blue-200"
            >
              {name}
            </div>
          );
        })}
    </div>
  );
};
