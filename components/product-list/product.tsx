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
      className="px-1.5"
    >
      <div className="overflow-hidden h-full rounded-sm bg-white hover:-translate-y-[0.0625rem] hover:shadow-md transition-transform">
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
        <div className="p-2">
          <div className="line-clamp-2 text-xs min-h-[2rem]">
            {product.product_name}
          </div>
          <div className="mt-3 flex items-center gap-x-1 flex-wrap">
            {product.product_discount > 0 && (
              <div className="text-gray2 text-sm line-through ">
                <span> {formatPriceVND(product.product_originalPrice)}</span>
              </div>
            )}
            <div className="text-red  ">
              <span>{formatPriceVND(product.product_price)}</span>
            </div>
          </div>
          <div className="mt-3 text-xs flex items-center">
            {product.product_ratingsAverage > 0 && (
              <div className="flex items-center">
                {product.product_ratingsAverage}
                <svg
                  enableBackground="new 0 0 15 15"
                  viewBox="0 0 15 15"
                  x={0}
                  y={0}
                  fill="#ffce3d"
                  className="h-3 w-3"
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
