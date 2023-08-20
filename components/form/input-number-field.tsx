import React, { InputHTMLAttributes } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

export interface InputNumberFieldProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  // name: string;
  // control: Control<any>;
  name: Path<T>;
  control: Control<T>;
  hideError?: boolean;
  classNameParent?: string;
}

export function InputNumberField<T extends FieldValues>({
  name,
  control,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  value: externalValue,
  className = "p-1  shadow-lg",
  hideError = false,
  classNameParent = "",
  ...rest
}: InputNumberFieldProps<T>) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  return (
    <div className={`relative ${classNameParent}`}>
      <input
        type="number"
        name={name}
        onBlur={onBlur}
        value={value}
        ref={ref}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e);
          externalOnChange && externalOnChange(e);
        }}
        className={`bg-white rounded-sm border border-gray3 focus:border-orange outline-none  w-full  ${className}  ${
          error && "border-red1"
        }`}
        {...rest}
      ></input>
      {hideError && (
        <div className="absolute -bottom-1/2 text-red1">
          {error && error?.message}
        </div>
      )}
    </div>
  );
}
