import React from "react";

interface SelectProps<T> {
  type?: string;
  value: string;
  onChange: (status: string) => void;
  options: T[];
  getOptionsLabel: (option: T) => string;
  getOptionsValue: (option: T) => string;
}

export function Select<T>({
  type,
  value,
  onChange,
  options,
  getOptionsLabel,
  getOptionsValue,
  ...props
}: SelectProps<T>) {
  const className = `text-blue-50 cursor-pointer text-sm py-2 px-3 border
    rounded-md bg-box font-medium shadow-sm-50 border-box`;
  return (
    <select
      className={className}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value)
      }
      {...props}
    >
      {options.map((option) => {
        const value = getOptionsValue(option);
        const label = getOptionsLabel(option);
        return (
          <option value={value} key={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
