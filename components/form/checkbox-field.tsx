import React, { InputHTMLAttributes } from "react";
import { Control, useController } from "react-hook-form";
import { Checkbox } from "../common/checkbox";

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
  className = "flex justify-start text-left items-center gap-x-3 ",
  classParent = "",
  classTextError = "text-sm text-red-100",
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
        <Checkbox
          onBlur={onBlur}
          onChange={onChange}
          checked={value}
          name={name}
          value={value}
          {...rest}
        />

        <div>{label}</div>
      </div>
      <div className={classTextError}>{error && error.message}</div>
    </div>
  );
}
