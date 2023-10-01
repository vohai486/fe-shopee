import { ProductRating } from "@/components/product-detail";
import { Review } from "@/types";
import { generateNameId } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function ReviewItem({
  review,
  onSubmit,
}: {
  review: Review;
  onSubmit: (content: string, product: string, review_parent: string) => void;
}) {
  const [showReply, setShowReply] = useState(false);
  const [content, setContent] = useState("");
  return (
    <div className="w-full border-b text-sm border-box py-6 px-3 ">
      <div className="flex items-start gap-x-3">
        <div className="w-10 h-10 shrink-0 border flex items-center justify-center overflow-hidden border-box rounded-full bg-box">
          {review.review_user.avatar ? (
            <Image
              src={review.review_user.avatar}
              width={40}
              height={40}
              alt=""
            />
          ) : (
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
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          )}
        </div>
        <div>
          <p className="text-blue-300 dark:text-grey-0">
            {review.review_user.fullName}
          </p>
          <ProductRating num={review.review_rating}></ProductRating>
        </div>
        <Link
          href={`/${generateNameId({
            name: "o",
            id: review.review_product,
          })}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="w-6 h-6 stroke-blue-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Link>
      </div>
      <div className="w-full overflow-x-auto sm:pl-12">
        <div className="py-2 px-3 mt-2 shadow-sm-50 rounded-lg  bg-box inline-block">
          {review.review_content}
        </div>
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
      </div>
      <div className="pl-16 mt-3">
        {review.review_child.map((item) => (
          <span
            key={item._id}
            className="px-3 bg-box rounded-lg shadow-sm-50 py-2"
          >
            {item.review_content}
          </span>
        ))}
      </div>
      <div className="flex py-2 items-center gap-x-3">
        <span
          onClick={() => setShowReply(!showReply)}
          className="text-blue-200 cursor-pointer"
        >
          Reply
        </span>
        {showReply && (
          <>
            <input
              className="rounded py-1 px-2 w-1/2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              onClick={async () => {
                await onSubmit(content, review.review_product, review._id);
                setShowReply(false);
                setContent("");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="w-5 h-5 stroke-blue-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
