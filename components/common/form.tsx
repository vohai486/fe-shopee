import { FormHTMLAttributes, ReactElement, ReactNode } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {}

export function Form(props: FormProps) {
  return <form {...props}></form>;
}
function Row({
  label,
  error,
  children,
  position = "items-center",
  hiddenError = false,
  columns = "1fr 2fr 1fr",
}: {
  label: ReactNode;
  error: string;
  children: ReactElement;
  position?: string;
  hiddenError?: boolean;
  columns?: string;
}) {
  return (
    <div
      className={`py-3 grid [&:not(:last-child)]:border-b  [&:not(:last-child)]:border-box [&:first-child]:pt-0 [&:last-child]:pb-0 gap-6  ${position}`}
      style={{
        gridTemplateColumns: columns,
      }}
    >
      {label && (
        <label
          className="text-blue-50"
          htmlFor={children && children.props?.id}
        >
          {label}
        </label>
      )}
      {children}
      {!hiddenError && error && (
        <span className="text-sm text-red-200">{error}</span>
      )}
    </div>
  );
}
Form.Row = Row;
