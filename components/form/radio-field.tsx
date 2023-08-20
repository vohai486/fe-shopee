import React, { InputHTMLAttributes } from "react";
import { Control, useController } from "react-hook-form";

export interface RadioFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  control: Control<any>;
  classParent?: string;
  classOption?: string;
  arrayOptions: { label: string; value: number | string }[];
}

export function RadioField({
  control,
  name,
  classParent = "flex gap-x-3 items-center",
  classOption = "flex items-center gap-x-1",
  arrayOptions,
}: RadioFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  return (
    <div ref={ref} className={classParent}>
      {arrayOptions.map((option) => (
        <div key={option.value} className={classOption}>
          <input
            type="radio"
            value={option.value}
            className="radio radio-success h-5 w-5"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChange(e.target.value);
            }}
            checked={value.toString() === option.value.toString()}
          />
          {/* <input
            value={option.value}
            checked={value.toString() === option.value.toString()}
            type="radio"
            className="w-4 h-4 accent-orange"
            
          /> */}
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  );
}
// name="radio-5"
