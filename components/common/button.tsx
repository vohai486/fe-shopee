import React, { ButtonHTMLAttributes } from "react";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  label: string;
}

export function Button({
  isLoading = false,
  label,
  className = "w-full py-2 font-medium bg-blue-200 text-grey-0  rounded-md",
  ...rest
}: IButtonProps) {
  return (
    <button
      className={`${className} w-[150px] ${
        isLoading && "pointer-events-none opacity-60"
      }`}
      {...rest}
    >
      {isLoading ? (
        <div
          className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        ></div>
      ) : (
        label
      )}
    </button>
  );
}
