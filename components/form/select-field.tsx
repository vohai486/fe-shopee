import React, { SelectHTMLAttributes } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

export interface SelectFieldProps<T extends FieldValues>
  extends SelectHTMLAttributes<HTMLSelectElement> {
  name: Path<T>;
  control: Control<T>;
  array: { label: string; value: string }[];
  showError?: boolean;
}

export function SelectField<T extends FieldValues>({
  name,
  control,
  array = [],
  showError,
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
        className={`text-sm py-2 px-3 border
        rounded-md   ${error && "error"}`}
        value={value}
        onChange={onChange}
      >
        <option value="">Chọn</option>
        {array.length > 0 &&
          array.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
      </select>
      {showError && (
        <div className="h-5 text-red1">{error && error.message}</div>
      )}
    </>
  );
}
