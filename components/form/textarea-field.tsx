import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Control, useController, FieldValues, Path } from "react-hook-form";

interface InputFieldProps<T extends FieldValues>
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: Path<T>;
  control: Control<T>;
  classParent?: string;
  classTextError?: string;
}

export function TextareaField<T extends FieldValues>({
  name,
  control,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  value: externalValue,
  className = "px-3 py-2 w-full text-sm rounded-md",
  classParent = "w-full",
  classTextError = "text-sm text-red-100 min-h-[20px]",
  ...rest
}: InputFieldProps<T>) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  return (
    <>
      <textarea
        name={name}
        onBlur={onBlur}
        value={value}
        ref={ref}
        onChange={(e) => {
          onChange(e);
          externalOnChange && externalOnChange(e);
        }}
        className={`${className} ${error && "error"}`}
        style={{
          resize: "none",
        }}
        {...rest}
      ></textarea>
      <div className={classTextError}>{error && error.message}</div>
    </>
  );
}
