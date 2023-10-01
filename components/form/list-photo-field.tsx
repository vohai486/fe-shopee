import Image from "next/image";
import { ChangeEvent, useRef } from "react";
import {
  Control,
  useFieldArray,
  FieldErrors,
  Merge,
  FieldError,
  FieldErrorsImpl,
} from "react-hook-form";

export interface ListPhotoFieldProps {
  name: string;
  control: Control<any>;
  errors: Merge<
    FieldError,
    FieldErrorsImpl<{
      content: string;
      rating: number;
      images: { file: File; previewUrl: string }[];
      idProduct: string;
    }>
  >;
}
export function ListPhotoField({ name, control, errors }: ListPhotoFieldProps) {
  const { fields, append, remove, move, insert } = useFieldArray({
    control,
    name,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    inputRef?.current?.click();
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const listFile = e.target.files;
    if (listFile?.length === 0 || !listFile) return;
    Array.from(listFile).forEach((item) => {
      if (!item) return;
      insert(0, {
        file: item,
        previewUrl: URL.createObjectURL(item),
      });
    });
  };
  return (
    <div>
      <div className="flex gap-x-2 flex-wrap">
        {fields.map((item: any, idx) => {
          const error = !!errors?.images && errors.images[idx];
          return !!item?.previewUrl ? (
            <div
              key={item.id}
              className={`w-12 h-12 overflow-hidden rounded-md group relative cursor-pointer border-2 border-box ${
                error && "border-red-100 dark:border-red-100"
              }`}
            >
              <Image
                width={100}
                height={100}
                src={item.previewUrl}
                alt=""
                className="object-cover w-12 h-12"
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute  opacity-0 group-hover:opacity-100 top-0 right-0  h-4 w-4 rounded-full flex items-center justify-center bg-gray3 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  className="w-3 h-3 stroke-orange"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : null;
        })}
        <div
          onClick={handleClick}
          className="w-12 cursor-pointer h-12 border flex items-center justify-center border-box border-dashed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="w-7 h-7 stroke-blue-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
        <input
          onChange={handleFileChange}
          type="file"
          ref={inputRef}
          hidden
          multiple
          accept="image/*"
        />
      </div>
      <div className="text-red-100 h-5">
        {!!errors.images && Array.isArray(errors.images)
          ? errors.images.filter((error) => error)[0]?.file?.message
          : errors.images?.message}
      </div>
    </div>
  );
}
