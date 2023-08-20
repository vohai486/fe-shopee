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
    <div className="text-black flex justify-center">
      <button
        onClick={() => {
          handleDecrement();
        }}
        type="button"
        className={`px-1.5 border border-gray3 `}
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
      <input
        value={value}
        onChange={handleChange}
        type="number"
        className="w-12 text-center bg-white outline-none focus:border-orange h-8 border border-gray3"
      />
      <button
        onClick={() => handleIncrement()}
        className="px-1.5 border border-gray3"
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
