import { InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Checkbox({ id = "all", ...rest }: CheckboxProps) {
  return (
    <div className="checkbox-wrapper">
      <div className="round">
        <input
          aria-describedby="helper-checkbox-text"
          type="checkbox"
          id={id}
          {...rest}
        />
        <label htmlFor={id} />
      </div>
    </div>
  );
}
