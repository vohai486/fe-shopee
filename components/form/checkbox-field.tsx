import React, { InputHTMLAttributes } from "react";
import { Control, useController } from "react-hook-form";

export interface CheckboxFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  control: Control<any>;
  classParent?: string;
  classTextError?: string;
  label?: string;
}

export function CheckboxField({
  name,
  control,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  value: externalValue,
  className = "flex justify-start text-left items-center gap-x-3 bg-white",
  classParent = "",
  classTextError = "text-sm text-red1 min-h-[20px]",
  label,
  ...rest
}: CheckboxFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  return (
    <div className={classParent}>
      <div className={className}>
        <input
          type="checkbox"
          checked={value}
          name={name}
          value={value}
          onBlur={onBlur}
          ref={ref}
          onChange={onChange}
          className="checkbox rounded-sm checkbox-accent w-4 h-4"
          {...rest}
        ></input>
        <div>{label}</div>
      </div>
      <div className={classTextError}>{error && error.message}</div>
    </div>
  );
}
