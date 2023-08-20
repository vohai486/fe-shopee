import { useClickOutSide } from "@/hooks";
import React, { useRef, useState } from "react";
import { Control, useController } from "react-hook-form";

export interface DateFieldProps {
  name: string;
  control: Control<any>;
}

const DateItem = ({
  array,
  checked,
  onChange,
  type,
}: {
  array: { label: string | number; value: number }[];
  checked: number;
  onChange: (value: number, type: string) => void;
  type: "date" | "year" | "month";
}) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useClickOutSide(ref, () => setShow(false));
  return (
    <div className="relative flex-1 sm:flex-[unset] cursor-pointer" ref={ref}>
      <div
        onClick={() => setShow(true)}
        className="h-10 w-full sm:w-28 border  border-gray3 cursor-pointer flex items-center justify-between px-4"
      >
        <span>{checked}</span>
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
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
      {show && (
        <div className="absolute z-20 shadow-md px-2 w-full max-h-[100px] overflow-auto bg-white  left-0">
          {array.map((ele) => {
            return (
              <div
                onClick={() => {
                  onChange(+ele.value, type);
                  setShow(false);
                }}
                key={ele.value}
                className={`hover:text-orange py-1 ${
                  checked === ele.value && "text-orange"
                } `}
              >
                {ele.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export function DateField({ name, control }: DateFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  let date = new Date(value).getDate();
  let month = new Date(value).getMonth() + 1;
  let year = new Date(value).getFullYear();
  const handleChange = (value: number, type: string) => {
    type === "year"
      ? (year = value)
      : type === "month"
      ? (month = value)
      : (date = value);
    onChange(new Date(`${month}-${date}-${year}`));
  };
  return (
    <div className="flex gap-x-2 sm:flex-row flex-col gap-y-1" ref={ref}>
      <DateItem
        array={Array.from({ length: 31 }, (_, index) => ({
          value: index + 1,
          label: index + 1,
        }))}
        checked={date}
        onChange={handleChange}
        type="date"
      />
      <DateItem
        array={Array.from({ length: 12 }, (_, index) => ({
          value: index + 1,
          label: `Tháng ${index + 1}`,
        }))}
        checked={month}
        onChange={handleChange}
        type="month"
      />
      <DateItem
        array={Array.from(
          { length: new Date().getFullYear() - 1960 + 1 },
          (_, index) => ({
            value: 1960 + index,
            label: 1960 + index,
          })
        )}
        checked={year}
        onChange={handleChange}
        type="year"
      />
    </div>
  );
}
