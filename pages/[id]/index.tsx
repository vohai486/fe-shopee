import { cartApi } from "@/api-client/cart-api";
import { productApi as productApiServer, reviewApi } from "@/api-server";
import { Seo } from "@/components/common";
import { ButtonChatShop } from "@/components/common/button-chat-shop";
import { MainLayout } from "@/components/layouts";
import { AddToCartFrom, ProductRating } from "@/components/product-detail";
import { Product, ProductSelect, Review } from "@/types";
import { formatPriceVND, generateNameId, getIdFromNameId } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { toast } from "react-toastify";
type PropsPage = {
  product: Product;
  reviews: Review[];
};

interface Params extends ParsedUrlQuery {
  id: string;
}
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await productApiServer.getAll({});
  return {
    paths: res.metadata.products.map((product: ProductSelect) => ({
      params: { id: product._id },
    })),
    fallback: true,
  };
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
      revalidate: 60,
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
      <div className="container text-13px my-5 ">
        <div className="pb-5 hidden md:flex items-center">
          <Link href="/" className="text-blue">
            Bách Hóa Online
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 stroke-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>

          {product.product_name}
        </div>
        <div className="bg-white shadow-sm">
          <div className="grid grid-cols-10">
            <div className="col-span-10 md:col-span-5 lg:col-span-4 p-4">
              <div className="relative pt-[100%] w-full bg-white">
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
            <div className="col-span-10 p-3 md:p-5  md:col-span-5 lg:col-span-6 lg:pt-5 lg:pr-9 lg:pb-0 lg:pl-5 text-sm">
              <div className="mb-2 text-blue text-xs font-medium">
                {product.product_brand}
              </div>
              <div className="text-xl font-medium">{product.product_name}</div>
              <div className="flex mt-2 mb-4 w400:flex-row flex-col gap-y-1">
                {product.product_ratingsAverage > 0 && (
                  <div className="flex pr-4 w400:border-r border-r-gray3 items-center gap-x-1 text-gray4">
                    <span className="text-base border-b font-medium border-b-orange text-orange">
                      {product.product_ratingsAverage}
                    </span>
                    <ProductRating num={product.product_ratingsAverage} />
                  </div>
                )}
                {product.product_reviewCount > 0 && (
                  <div className="w400:px-4 w400:border-r border-r-gray3">
                    <span className="text-black mr-2  font-medium border-b border-b-black text-base">
                      {product.product_reviewCount}
                    </span>
                    Đánh Giá
                  </div>
                )}
                {product.product_quantity_sold > 0 && (
                  <div className="w400:px-4 ">
                    <span className="text-black mr-2 font-medium border-b border-b-black text-base">
                      {product.product_quantity_sold}
                    </span>
                    Đã Bán
                  </div>
                )}
              </div>
              <div className="p-1 w400:p-2 sm:px-5 sm:py-4 inline-block mb-6 bg-gray1 rounded-sm">
                <div className="flex items-center gap-x-3">
                  {product.product_discount > 0 && (
                    <div className="line-through text-gray4 text-sm sm:text-base">
                      {formatPriceVND(product.product_originalPrice)}
                    </div>
                  )}
                  <div className="text-orange text-lg sm:text-3xl ">
                    {formatPriceVND(product.product_price)}
                  </div>
                  <div className="bg-orange sm:px-1 text-white text-xs rounded-sm">
                    {product.product_discount > 0 &&
                      `${product.product_discount}% giảm`}
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
        <div className="mt-4">
          <div className="bg-white p-4 lg:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-y-4">
              <div className="flex w400:flex-row flex-col gap-y-2 items-center shrink-0 gap-x-3 md:pr-6 md:border-r border-r-gray1">
                <div className="flex justify-center  shrink-0 overflow-hidden relative ">
                  <Image
                    src={product.product_shop.shop_avatar}
                    alt="prduct"
                    width={100}
                    height={100}
                    className="border border-gray1 bg-white w-20 h-20 object-cover rounded-full"
                  />
                </div>
                <div className="flex flex-col grow items-center w400:items-stretch">
                  <h3 className="text-base mb-2 w400:mb-4">
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
                      className="text-black gap-x-2 font-medium hover:bg-gray1 flex items-center border border-gray3 bg-white py-1 px-2 rounded-sm"
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
              </div>
              <div className="flex gap-x-4 justify-center w400:justify-normal  md:w-full md:pl-6 text-gray4   md:justify-between text-sm text-medium">
                <div>Đánh Giá</div>
                <div className="text-orange ">
                  {product.product_shop.shop_ratingsAverage}
                </div>

                <div>|</div>
                <div>Người Theo Dõi</div>
                <div className="text-orange ">
                  {product.product_shop.shop_followers}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="p-2 md:p-6 bg-white">
            <div className="p-3   bg-gray text-black uppercase text-lg font-medium">
              chi tiết sản phẩm
            </div>
            <div className="md:p-3 px-1 pt-4 md:pt-7">
              <div className="flex flex-col gap-y-5">
                {product?.product_specifications &&
                  product.product_specifications.map((item) => (
                    <div key={item.key} className="flex text-sm gap-x-2">
                      <span className="text-gray4 w-[120px] shrink-0">
                        {item.key}
                      </span>
                      <div className="grow">{item.value}</div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="p-3   mt-5 bg-gray text-black uppercase text-lg font-medium">
              mô tả sản phẩm
            </div>
            <div className="md:p-3 px-1 pt-4 md:pt-7 text-sm">
              <div
                dangerouslySetInnerHTML={{
                  __html: product.product_description,
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className=" sm:p-6 py-3  md:px-6 px-2 bg-white">
            <div className="pb-4 px-3 border-gray3 border-b  sm:items-center justify-between ">
              <p className="text-black uppercase text-lg font-medium mb-2">
                đánh giá sản phẩm
              </p>
              {product.product_ratingsAverage > 0 && (
                <div className="flex items-center gap-x-5">
                  <div className="text-orange text-lg font-medium">
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
                <div
                  key={review._id}
                  className={`p-3 ${idx !== 0 && "border-t border-gray3"}`}
                >
                  <div className="flex items-start gap-x-3">
                    <div className="w-10 h-10 shrink-0 overflow-hidden rounded-full bg-white">
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
                      <p>{review.review_user.fullName}</p>
                      <ProductRating num={review.review_rating}></ProductRating>
                    </div>
                  </div>
                  <div className="w-full overflow-x-auto sm:pl-12">
                    <div className="mt-3">{review.review_content}</div>
                    <div className="w-full">
                      {review.review_images.length > 0 && (
                        <div className="flex  mt-3 whitespace-nowrap  overflow-x-auto hidden-scroll">
                          {review.review_images.map((image) => (
                            <div
                              key={image}
                              className="shadow border mr-2 border-gray3 min-w-[80px] h-20 inline-block"
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
                </div>
              ))}
            </div>
            <div>
              {reviews.length === 0 && (
                <div className="bg-red/5 border border-gray1 p-4 text-sm">
                  Sản phẩm chưa có đánh giá nào
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
ProductDetailPage.Layout = MainLayout;
