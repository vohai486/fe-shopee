import Link from "next/link";
import * as React from "react";
import { RatingStars } from "./rating-stars";
import { ParsedUrlQuery } from "querystring";
import { Category } from "@/types";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { InputNumberField } from "../form/input-number-field";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type FormData = {
  minPrice: string;
  maxPrice: string;
};
function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { minPrice, maxPrice } = this.parent;
  if (minPrice !== "" && maxPrice !== "") {
    return Number(maxPrice) >= Number(minPrice);
  }
  return minPrice !== "" || maxPrice !== "";
}
export function AsideFilter({
  query,
  listCategory,
  pathName = "/",
  nameRating,
}: {
  query: ParsedUrlQuery;
  listCategory: Category[];
  pathName?: string;
  nameRating: string;
}) {
  const router = useRouter();
  const schema = yup.object().shape({
    minPrice: yup.string().test({
      name: "price-not-allowed",
      message: "Giá không phù hợp",
      test: testPriceMinMax,
    }),
    maxPrice: yup.string().test({
      name: "price-not-allowed",
      message: "Giá không phù hợp",
      test: testPriceMinMax,
    }),
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      minPrice: "",
      maxPrice: "",
    },
    resolver: yupResolver(schema as any),
    mode: "onChange",
    shouldFocusError: false,
  });
  const handleFilterPrice = (values: {
    minPrice: string;
    maxPrice: string;
  }) => {
    reset();
    const { minPrice, maxPrice } = values;
    router.push({
      pathname: pathName,
      query: {
        ...query,
        minPrice: minPrice,
        maxPrice: maxPrice,
      },
    });
  };

  return (
    <>
      <div className="flex capitalize border-bottom  border-box font-bold gap-2 items-center py-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        Tất cả danh mục
      </div>
      <ul className="text-sm">
        {listCategory &&
          listCategory.map((category) => (
            <li key={category._id}>
              <Link
                href={{
                  pathname: pathName,
                  query: { ...query, category: category._id },
                }}
                className={`flex relative py-2 px-3 font-semibold ${
                  category._id === query.category && "text-blue-200 "
                } `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3 h-3 absolute left-0 top-1/2 -translate-y-1/2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
                {category.category_name}
              </Link>
            </li>
          ))}
      </ul>
      <div className="flex capitalize font-bold gap-2 items-center py-2 border-bottom border-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
          />
        </svg>
        Bộ lọc tìm kiếm
      </div>
      <div className="py-2">
        <div className="mb-3 text-sm">Khoảng Giá</div>
        <form onSubmit={handleSubmit(handleFilterPrice)}>
          <div className="flex items-center ">
            <InputNumberField
              value={query.minPrice}
              control={control}
              name="minPrice"
              hideError={true}
            ></InputNumberField>
            <div className="mx-1 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 12H6"
                />
              </svg>
            </div>
            <InputNumberField
              control={control}
              hideError={true}
              name="maxPrice"
              value={query.maxPrice}
            ></InputNumberField>
          </div>
          <div className="text-sm flex justify-center min-h-[1.25rem]">
            {Object.keys(errors).length > 0 && Object.values(errors)[0].message}
          </div>
          <button className="w-full h-8 rounded-md text-sm btn-blue-200 capitalize">
            Áp dụng
          </button>
        </form>
      </div>
      <RatingStars nameRating={nameRating} query={query} pathName={pathName} />
    </>
  );
}
