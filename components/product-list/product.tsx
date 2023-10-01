import { ProductSelect } from "@/types/product.types";
import { formatPrice, formatPriceVND, generateNameId } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export interface ProductProps {
  product: ProductSelect;
}

export function Product({ product }: ProductProps) {
  if (!product) return null;
  return (
    <Link
      href={`/${generateNameId({
        name: product.product_name,
        id: product._id,
      })}`}
      className="w400:px-1.5"
    >
      <div className="overflow-hidden p-2 rounded-md bg-box border border-box h-full flex flex-col   hover:-translate-y-[0.0625rem] hover:shadow-sm-50 transition-transform">
        <div className="w-full pt-[100%] relative">
          <Image
            alt={product.product_name}
            width={500}
            height={500}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              left: 0,
              top: 0,
              backgroundColor: "white",
              objectFit: "cover",
            }}
            src={product.product_thumb}
          ></Image>
        </div>
        <div className="pt-2 flex flex-col  grow gap-y-1">
          <div className="grow-1 h-full">
            <h3 className="line-clamp-2 text-blue-300 dark:text-grey-0 text-sm min-h-[2rem]">
              {product.product_name}
            </h3>
            <div className="flex mt-1 gap-x-2 items-center">
              <p className=" dark:text-grey-300 font-medium ">
                {formatPriceVND(product.product_price)}
              </p>
              {product.product_discount > 0 && (
                <div className="p-1 rounded-md bg-blue-200 text-grey-0 text-center text-xs text-brand-50">
                  -{product.product_discount}%
                </div>
              )}
            </div>
            <p className="text-blue-100 mt-1  text-sm line-through ">
              {formatPriceVND(product.product_originalPrice)}
            </p>
          </div>
          <div className="shrink-0 text-xs flex items-center">
            {product.product_ratingsAverage > 0 && (
              <div className="flex items-center">
                {product.product_ratingsAverage}
                <svg
                  enableBackground="new 0 0 15 15"
                  viewBox="0 0 15 15"
                  x={0}
                  y={0}
                  className="h-3 w-3 fill-yellow-100"
                >
                  <polygon
                    points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                  />
                </svg>
              </div>
            )}
            {product.product_quantity_sold > 0 &&
              product.product_ratingsAverage > 0 && (
                <div className="mx-2">|</div>
              )}
            {product.product_quantity_sold > 0 && (
              <span>Đã bán {product.product_quantity_sold}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
