import { vi } from "date-fns/locale";
import React, { InputHTMLAttributes } from "react";
import DatePicker from "react-datepicker";
import { Control, useController } from "react-hook-form";

export interface InputDateFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  control: Control<any>;
  classNameError?: string;
  onTrigger?: () => void;
}

export function InputDateField({
  name,
  control,
  classNameError,
  placeholder,
  onTrigger,
}: InputDateFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  return (
    <div className="w-full">
      <DatePicker
        locale={vi}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        selected={value}
        onChange={(date) => {
          onChange(date);
          onTrigger && onTrigger();
        }}
        className={`outline-none border bg-white border-gray3 w-full px-3 py-2 focus:border-orange text-black ${
          error && "border-red1"
        }`}
      />
    </div>
  );
}
