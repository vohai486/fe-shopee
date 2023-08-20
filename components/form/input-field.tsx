import React, { InputHTMLAttributes } from "react";
import { Control, useController } from "react-hook-form";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  control: Control<any>;
  classParent?: string;
  classTextError?: string;
}

export function InputField({
  name,
  control,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  value: externalValue,
  className = "px-3 py-2 w-full outline-none border border-gray3 rounded-sm focus:border-orange",
  type = "text",
  classParent = "",
  classTextError = "min-h-[20px]",
  ...rest
}: InputFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    defaultValue: "",
    name,
    control,
  });
  return (
    <div className={classParent}>
      <input
        type={type}
        name={name}
        onBlur={onBlur}
        value={value}
        ref={ref}
        onChange={onChange}
        className={`bg-white ${className} ${error && "border-red1"}`}
        {...rest}
      ></input>
      <div className={`text-xs sm:text-sm text-red1 ${classTextError}`}>
        {error && error.message}
      </div>
    </div>
  );
}
