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
  className = "p-1",
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
          if (e.target.value === "") {
            e.target.value = "0";
            onChange(e);
            externalOnChange && externalOnChange(e);
            return;
          }
          if (e.target.value.length > 1 && e.target.value.charAt(0) === "0") {
            e.target.value = e.target.value.slice(1);
            onChange(e);
            externalOnChange && externalOnChange(e);
            return;
          }
          onChange(e);
          externalOnChange && externalOnChange(e);
        }}
        className={` rounded-md border  w-full  ${className}  ${
          error && "error"
        }`}
        {...rest}
      ></input>
      {!hideError && (
        <div className="absolute -bottom-1/2 text-red-200">
          {error && error?.message}
        </div>
      )}
    </div>
  );
}
