import Image from "next/image";
import { ChangeEvent, ReactNode, useRef } from "react";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  useController,
} from "react-hook-form";

type PhotoFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  showError?: boolean;
  children?: ReactNode;
};

export function PhotoField<T extends FieldValues>({
  name,
  control,
  showError,
  children,
}: PhotoFieldProps<T>) {
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
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({
      file,
      previewUrl: url,
    } as any);
  };

  const previewUrl = value?.previewUrl;
  return (
    <div>
      <input
        onChange={handleFileChange}
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
      />
      <div
        className={`w-20 h-20 border border-box border-dashed flex justify-center items-center ${
          error && "border-red-100 dark:border-red-100 text-red-100"
        }`}
        onClick={handleClick}
      >
        {previewUrl ? (
          <Image src={previewUrl} width={80} height={80} alt="" />
        ) : (
          <div className="flex flex-col items-center cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            Thêm Hình
          </div>
        )}
      </div>
      {showError && (
        <div className="h-5 text-red1 ">{error && error.message}</div>
      )}
    </div>
  );
}
