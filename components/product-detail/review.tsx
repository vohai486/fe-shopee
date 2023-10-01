import { Review } from "@/types";
import Image from "next/image";
import * as React from "react";
import { ProductRating } from "./product-rating";

export interface ReviewProps {
  review: Review;
}

export function Review({ review }: ReviewProps) {
  return (
    <div key={review._id} className={`px-0 py-3 md:p-3 border-t border-box`}>
      <div className="flex items-start gap-x-3">
        <div className="w-10 h-10 shrink-0 overflow-hidden border-box rounded-full bg-box">
          {review.review_user.avatar && (
            <Image
              src={review.review_user.avatar}
              width={40}
              height={40}
              alt=""
            />
          )}
        </div>
        <div>
          <p className="text-blue-300 dark:text-grey-0">
            {review.review_user.fullName}
          </p>
          <ProductRating num={review.review_rating}></ProductRating>
        </div>
      </div>
      <div className="w-full overflow-x-auto sm:pl-12">
        <div className="mt-3">{review.review_content}</div>
        <div className="w-full">
          {review.review_images.length > 0 && (
            <div className="flex  mt-3 whitespace-nowrap overflow-x-auto  hidden-scroll">
              {review.review_images.map((image) => (
                <div
                  key={image}
                  className="shadow border mr-2 border-box min-w-[80px] h-20 inline-block"
                >
                  <Image
                    width={100}
                    height={100}
                    alt=""
                    src={image}
                    className="w-full h-full object-cover"
                  ></Image>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4 ml-5">
          {review.review_child.map((item) => (
            <span className="p-1 border border-box rounded-md" key={item._id}>
              {item.review_content}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
