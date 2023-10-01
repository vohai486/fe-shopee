import { RATING } from "@/constants";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  useController,
} from "react-hook-form";

export interface RatingFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  isShowLabel?: boolean;
}

export function RatingField<T extends FieldValues>({
  name,
  control,
  isShowLabel = true,
}: RatingFieldProps<T>) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  const handleSelectRating = (value: number) => {
    onChange(value as PathValue<number, Path<number>>);
  };
  return (
    <div ref={ref}>
      <p
        className={`text-center  mb-3 ${
          error ? "text-red-100 " : "text-title"
        } `}
      >
        {value === 0 && !error && "Vui lòng đánh giá"}
        {value === 1 && RATING.ONE}
        {value === 2 && RATING.TWO}
        {value === 3 && RATING.THREE}
        {value === 4 && RATING.FOUR}
        {value === 5 && RATING.FIVE}
        {error && error.message}
      </p>

      <div className="flex justify-center items-center space-x-1">
        {Array.from({ length: 5 })
          .fill(0)
          .map((item, idx) => (
            <div
              key={idx}
              className={` cursor-pointer ${
                idx + 1 > value ? "text-title" : "text-yellow-100"
              }`}
              onClick={() => handleSelectRating(+idx + 1)}
            >
              <svg
                className="w-8 h-8"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            </div>
          ))}
      </div>
    </div>
  );
}
