import React, { SelectHTMLAttributes } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

export interface SelectFieldProps<T extends FieldValues>
  extends SelectHTMLAttributes<HTMLSelectElement> {
  name: Path<T>;
  control: Control<T>;
  array: { label: string; value: string }[];
  label: string;
}

export function SelectField<T extends FieldValues>({
  name,
  control,
  array = [],
  label = "Vui lòng chọn",
}: SelectFieldProps<T>) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  return (
    <>
      <select
        className={`w-full p-2 border bg-white border-gray3 outline-none rounded-sm focus:border-orange cursor-pointer ${
          error && "border-red1"
        }`}
        value={value}
        onChange={onChange}
      >
        <option value="" disabled>
          {label}
        </option>
        {array.length > 0 &&
          array.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
      </select>
      <div className="h-5 text-red1">{error && error.message}</div>
    </>
  );
}
