import React, { InputHTMLAttributes } from "react";
import { Control, useController } from "react-hook-form";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  control: Control<any>;
  classParent?: string;
  classTextError?: string;
  showError?: boolean;
}

export function InputField({
  name,
  control,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  value: externalValue,
  className = "px-3 py-2 rounded-md text-sm",
  type = "text",
  classParent = "",
  classTextError = "min-h-[20px]",
  showError = true,
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
        className={`${className} ${error && "error"}`}
        {...rest}
      ></input>
      {showError && (
        <div
          className={`text-xs sm:text-sm text-red-100 dark:red-100 ${classTextError}`}
        >
          {error && error.message}
        </div>
      )}
    </div>
  );
}
