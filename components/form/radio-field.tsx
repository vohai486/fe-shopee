import React, { InputHTMLAttributes } from "react";
import { Control, useController } from "react-hook-form";
import { Checkbox } from "../common/checkbox";

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
    <div ref={ref} className={`${classParent} radio-wrapper `}>
      {arrayOptions.map((option) => (
        <label key={option.value}>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChange(e.target.value);
            }}
            checked={value.toString() === option.value.toString()}
            type="radio"
            value={option.value}
            className={`input-radio focus:outline-none ${error && "error"}`}
            name="pilih"
          />{" "}
          {option.label}
        </label>
      ))}
      {error && <div className="text-red-100">{error.message}</div>}
    </div>
  );
}
// name="radio-5"
{
  /* <div key={option.value} className={classOption}>
          <input
            type="radio"
            value={option.value}
            className="radio radio-info h-5 w-5 "
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChange(e.target.value);
            }}
            checked={value.toString() === option.value.toString()}
          />

          <span>{option.label}</span>
        </div> 
        
        // <div key={option.value} className="flex items-center gap-x-2">
        //   <input
        //     type="radio"
        //     value={option.value}
        //     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        //       console.log(e.target.value);
        //       onChange(e.target.value);
        //     }}
        //     className="w-5 h-5"
        //     checked={value.toString() === option.value.toString()}
        //   />
        //   <label>{option.label}</label>
        // </div>
        
        */
}
