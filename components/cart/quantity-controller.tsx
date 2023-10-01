import * as React from "react";

export interface QuantityControllerProps {
  handleDecrement: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIncrement: () => void;
  value: number;
}

export function QuantityController({
  handleChange,
  handleDecrement,
  handleIncrement,
  value,
}: QuantityControllerProps) {
  return (
    <div className="flex">
      <button
        onClick={() => {
          handleDecrement();
        }}
        type="button"
        className="px-1.5 border border-r-0 bg-grey-0 text-blue-700 dark:text-grey-300 dark:bg-blue-500 border-box h-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          className="w-4 h-4 stroke-current"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
        </svg>
      </button>
      <input
        value={value}
        onChange={handleChange}
        type="number"
        className="w-12 text-center h-8"
      />
      <button
        onClick={() => handleIncrement()}
        className="px-1.5 border border-l-0 bg-grey-0 text-blue-700 dark:text-grey-300 dark:bg-blue-500 border-box h-8"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          className="w-4 h-4 stroke-current"
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
