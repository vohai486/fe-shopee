import * as React from "react";
import { Control } from "react-hook-form";
import { InputNumberField } from "./input-number-field";

export interface QuantityFieldProps {
  name: string;
  control: Control<any>;
  handleDecrement: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIncrement: () => void;
}

export function QuantityField({
  name,
  control,
  handleDecrement,
  handleChange,
  handleIncrement,
}: QuantityFieldProps) {
  return (
    <div className="text-black flex">
      <button
        onClick={() => {
          handleDecrement();
        }}
        type="button"
        className="px-1.5 border border-gray3 h-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="black"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
        </svg>
      </button>
      <InputNumberField
        className="!w-12 text-center  h-8"
        name={name}
        control={control}
        onChange={handleChange}
      />
      <button
        onClick={() => handleIncrement()}
        className="px-1.5 border border-gray3 h-8"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="black"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div>
  );
}
