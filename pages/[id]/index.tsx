import { cartApi } from "@/api-client/cart-api";
import { productApi as productApiServer, reviewApi } from "@/api-server";
import { Seo } from "@/components/common";
import { ButtonChatShop } from "@/components/common/button-chat-shop";
import { MainLayout } from "@/components/layouts";
import {
  AddToCartFrom,
  ProductRating,
  Review,
} from "@/components/product-detail";
import { Product, ProductSelect, Review as ReviewType } from "@/types";
import { formatPriceVND, generateNameId, getIdFromNameId } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { toast } from "react-toastify";
type PropsPage = {
  product: Product;
  reviews: ReviewType[];
};

interface Params extends ParsedUrlQuery {
  id: string;
}
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await productApiServer.getAll({});
  try {
    return {
      paths: res.metadata.products.map((product: ProductSelect) => ({
        params: { id: product._id },
      })),
      fallback: true,
    };
  } catch (error) {
    return { paths: [], fallback: false };
  }
};
export const getStaticProps: GetStaticProps<PropsPage, Params> = async (
  context
) => {
  const productId = getIdFromNameId(context.params?.id as string);
  if (!productId) return { notFound: true };
  try {
    const [productData, reviewData] = await Promise.all([
      productApiServer.getDetail(productId),
      reviewApi.getByUser(productId),
    ]);
    return {
      props: {
        product: productData.metadata,
        reviews: reviewData.metadata,
      },
      revalidate: 180,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default function ProductDetailPage({ product, reviews }: PropsPage) {
  const queryClient = useQueryClient();
  const addToCartMutation = useMutation({
    mutationFn: (body: { productId: string; quantity: number }) =>
      cartApi.addToCart(body),
  });
  const handleAddToCart = (quantity: number) => {
    addToCartMutation.mutate(
      {
        productId: product._id,
        quantity,
      },
      {
        onSuccess: (data) => {
          toast.success("Thêm vào giỏ hàng thành công");
          queryClient.invalidateQueries({
            queryKey: ["carts"],
          });
        },
      }
    );
  };

  if (!product) return null;
  return (
    <>
      <Seo
        data={{
          title: `Mua ${product.product_name}`,
          description: `Mua ${product.product_name}`,
          url: `http://localhost:3000/${generateNameId({
            name: product.product_name,
            id: product._id,
          })}`,
          thumbnailUrl: product.product_thumb,
        }}
      ></Seo>
      <div className="text-sm">
        <div className="pb-5 hidden md:flex items-center">
          <Link href="/" className="text-blue-200">
            Trang chủ
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
          <span className="line-clamp-1 text-blue-100">
            {product.product_name}
          </span>
        </div>
        <div className="p-4 md:p-8 shadow-sm-50 border rounded-md bg-box border-box">
          <div className="grid grid-cols-10 gap-y-3">
            <div className="col-span-10 md:col-span-5 lg:col-span-4">
              <div className="relative pt-[100%] w-full ">
                <div className="absolute top-0 w-full h-full ">
                  <Image
                    src={product.product_thumb}
                    alt="prduct"
                    width={600}
                    height={600}
                    style={{
                      position: "absolute",
                      width: "100%",
                      top: 0,
                      left: 0,
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-10 p-0 md:pl-6  md:col-span-5 lg:col-span-6  text-sm">
              <div className="mb-3 text-xs  ">{product.product_brand}</div>
              <div className="mb-5 text-xl text-blue-300 dark:text-grey-0 font-medium line-clamp-2">
                {product.product_name}
              </div>
              {(product.product_ratingsAverage > 0 ||
                product.product_reviewCount > 0 ||
                product.product_quantity_sold > 0) && (
                <div className="flex mb-5 w400:flex-row text-blue-50 flex-col gap-y-1 ">
                  {product.product_ratingsAverage > 0 && (
                    <div className="flex pr-3 w400:border-r  border-blue-50 items-center gap-x-2  text-gray4">
                      <span className="text-base border-b font-medium border-yellow-100 text-yellow-100">
                        {product.product_ratingsAverage}
                      </span>
                      <ProductRating num={product.product_ratingsAverage} />
                    </div>
                  )}
                  {product.product_reviewCount > 0 && (
                    <div className="w400:px-3 w400:border-r  border-blue-50">
                      <span className="text-blue-200 mr-2  font-medium border-b border-b-blue-50 text-base">
                        {product.product_reviewCount}
                      </span>
                      Đánh Giá
                    </div>
                  )}
                  {product.product_quantity_sold > 0 && (
                    <div className="w400:px-3">
                      <span className="text-blue-200 mr-2 font-medium border-b border-b-blue-50 text-base">
                        {product.product_quantity_sold}
                      </span>
                      Đã Bán
                    </div>
                  )}
                </div>
              )}
              <div className="mb-5 py-2 px-3 bg-grey-200/60 dark:bg-blue-500/60 rounded-md block w400:inline-block">
                <div className="flex items-center gap-x-2">
                  {product.product_discount > 0 && (
                    <div className="line-through text-sm sm:text-base">
                      {formatPriceVND(product.product_originalPrice)}
                    </div>
                  )}
                  <div className="text-blue-200 text-xl sm:text-3xl ">
                    {formatPriceVND(product.product_price)}
                  </div>
                  <div className="bg-blue-200 text-center px-1 text-grey-0 text-xs rounded-sm">
                    {product.product_discount > 0 &&
                      `giảm ${product.product_discount}%`}
                  </div>
                </div>
              </div>
              <AddToCartFrom
                onSubmit={handleAddToCart}
                quantity={product.product_quantity}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 md:p-8 bg-box border-box rounded-md  shadow-sm-50 border">
          <div className="flex flex-col md:flex-row md:items-center  gap-y-4">
            <div className="flex w400:flex-row flex-col gap-y-2 items-center shrink-0 gap-x-3 ">
              <div className="flex justify-center  shrink-0 overflow-hidden relative ">
                <Image
                  src={product.product_shop.shop_avatar}
                  alt="prduct"
                  width={100}
                  height={100}
                  className="border border-box bg-box  w-20 h-20 object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col items-center w400:items-stretch">
                <div className="flex sm:flex-row flex-col sm:mb-6 mb-4 w400:items-stretch items-center sm:items-center gap-x-5 gap-y-1">
                  <h3 className="text-base text-blue-300 dark:text-grey-0">
                    {product.product_shop.shop_name}
                  </h3>
                  <div className="flex gap-x-2">
                    <ButtonChatShop
                      conversation={{
                        _id: "",
                        user: {
                          _id: product.product_shop._id,
                          avatar: product.product_shop.shop_avatar,
                          fullName: product.product_shop.shop_name,
                        },
                      }}
                      label="Chat ngay"
                    />
                    <Link
                      href={`/shop/${product.product_shop._id}`}
                      className=" gap-x-2 font-medium hover:opacity-75 flex items-center border text-blue-500 dark:text-grey-0 border-blue-50    py-1 px-2 rounded-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                        />
                      </svg>
                      Xem Shop
                    </Link>
                  </div>
                </div>
                <div className="text-blue-50">
                  Người Theo Dõi:{" "}
                  <strong className="text-blue-200">
                    {product.product_shop.shop_followers}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4  md:p-8  border rounded-md bg-box border-box shadow-sm-50">
          <div className="p-3 text-blue-300 dark:text-grey-0 rounded-md md:mb-7 mb-4 bg-grey-200/60 dark:bg-blue-500/60 uppercase text-lg font-medium">
            chi tiết sản phẩm
          </div>
          <div className="md:p-3 pl-1">
            <div className="flex flex-col gap-y-5">
              {product?.product_specifications &&
                product.product_specifications.map((item) => (
                  <div key={item.key} className="flex text-sm gap-x-2">
                    <span className="text-blue-50 w-[120px] shrink-0">
                      {item.key}
                    </span>
                    <div className="grow text-blue-700 dark:text-grey-300">
                      {item.value}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="p-3 text-blue-300 dark:text-grey-0 rounded-md md:mb-7 mb-4 mt-5 bg-grey-200/60 dark:bg-blue-500/60 uppercase text-lg font-medium">
            mô tả sản phẩm
          </div>
          <div className="md:p-3 pl-1 text-sm">
            <div
              dangerouslySetInnerHTML={{
                __html: product.product_description,
              }}
            ></div>
          </div>
        </div>
        <div className="mt-4 p-4 md:p-8 border rounded-md bg-box border-box shadow-sm-50">
          <div className="border-b border-box pb-2 sm:items-center justify-between ">
            <div className="text-blue-300 dark:text-grey-0 p-3 rounded-md mb-2 dark:bg-grey-100-dark bg-grey-200/60 dark:bg-blue-500/60  uppercase text-lg font-medium">
              đánh giá sản phẩm
            </div>
            {product.product_ratingsAverage > 0 && (
              <div className="flex pl-3 items-center gap-x-5">
                <div className="text-blue-200 text-lg font-medium">
                  <strong className="text-3xl font-medium">
                    {product.product_ratingsAverage}
                  </strong>{" "}
                  / 5
                </div>
                <ProductRating
                  num={product.product_ratingsAverage}
                ></ProductRating>
              </div>
            )}
          </div>
          <div>
            {reviews.map((review, idx) => (
              <Review review={review} key={review._id}></Review>
            ))}
          </div>
          <div>
            {reviews.length === 0 && (
              <div className="rounded-md border border-red-200 dark:text-grey-100 text-blue-50 p-4 text-sm">
                Sản phẩm chưa có đánh giá nào
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
ProductDetailPage.Layout = MainLayout;
