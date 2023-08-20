import React, { ButtonHTMLAttributes } from "react";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  label: string;
}

export function Button({
  isLoading = false,
  label,
  className = "w-full h-[50px] bg-orange text-white rounded-sm",
}: IButtonProps) {
  return (
    <button
      className={`${className} relative ${
        isLoading && "pointer-events-none opacity-60"
      }`}
    >
      {isLoading ? (
        <div
          className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        ></div>
      ) : (
        label
      )}
    </button>
  );
}
