import React, { InputHTMLAttributes, ReactElement, useRef } from "react";
import { toast } from "react-toastify";
import { Control, useController, UseFormSetError } from "react-hook-form";

export interface InputFileProps {
  handleChangeFile?: (file: File) => void;
  name: string;
  control: Control<any>;
  setError: UseFormSetError<any>;
  children: ReactElement;
  position?: string;
}

export function InputFile({
  name,
  control,
  handleChangeFile,
  setError,
  children,
  position = "text-center",
}: InputFileProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    inputRef?.current?.click();
  };
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0];
    if (fileFromLocal && fileFromLocal?.size >= 1048576) {
      setError("image", {
        type: "filetype",
        message: "Dung lượng file tối đa 1MB",
      });
    } else {
      onChange(fileFromLocal);
      handleChangeFile && handleChangeFile(fileFromLocal as File);
    }
  };
  return (
    <div className={position}>
      <input
        onChange={onChangeFile}
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
      />
      <div onClick={handleClick}>{children}</div>
      <div className="h-5 text-red1 ">{error && error.message}</div>
    </div>
  );
}
