import { productApi, shopApi as shopApiClient, userApi } from "@/api-client";
import { shopApi as shopApiServer } from "@/api-server";
import { Loading, Seo } from "@/components/common";
import { MainLayout } from "@/components/layouts";
import {
  Product,
  SortProductList,
  AsideFilter,
} from "@/components/product-list";
import { useAuth, useClickOutSide } from "@/hooks";
import { ShopResponse, SuccessResponseApi } from "@/types";
import { timeSince } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useRef, useState } from "react";

type PropsPage = {
  data: SuccessResponseApi<ShopResponse>;
};

interface Params extends ParsedUrlQuery {
  id: string;
}
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await shopApiServer.getAll();
  return {
    paths: res.metadata.map(
      ({ shop_name, _id }: { shop_name: string; _id: string }) => ({
        params: { id: _id },
      })
    ),
    fallback: true,
  };
};
export const getStaticProps: GetStaticProps<PropsPage, Params> = async (
  context
) => {
  const shopId = context.params?.id as string;
  if (!shopId) return { notFound: true };
  try {
    const data = await shopApiServer.getDetailShop(shopId);
    return {
      props: {
        data: data,
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default function ShopDetailPage({ data }: PropsPage) {
  const [showAside, setShowAside] = useState(false);
  const divRef = useRef(null);
  useClickOutSide(divRef, () => setShowAside(false));
  const router = useRouter();
  const { profile } = useAuth();
  let { id, ...query } = router.query;
  const {
    data: shopData,
    refetch,
    isLoading: isLoadingShop,
    isFetching,
  } = useQuery({
    queryKey: ["shop", id],
    queryFn: () => shopApiClient.getDetailShop(data.metadata.shop.id),
    staleTime: 3 * 60 * 1000,
    enabled: !!data?.metadata,
  });
  const pathName = `/shop/${data?.metadata?.shop.id}`;
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", router.query],
    queryFn: () =>
      productApi.getAll({ ...router.query, shopId: data.metadata.shop.id }),
    staleTime: 3 * 60 * 1000,
    keepPreviousData: true,
    enabled: !!data?.metadata,
  });
  useEffect(() => {
    if (!!profile?._id) {
      refetch();
    }
  }, [profile, refetch]);
  const followMutation = useMutation({
    mutationFn: userApi.followShop,
    onSuccess: () => {
      refetch();
    },
  });
  const unFollowMutation = useMutation({
    mutationFn: userApi.unFollowShop,
    onSuccess: () => {
      refetch();
    },
  });
  const handleFollow = () => {
    followMutation.mutate({ shopId: data.metadata.shop.id });
  };
  const handleUnFollow = () => {
    unFollowMutation.mutate({ shopId: data.metadata.shop.id });
  };
  const handleRemoveFilters = () => {
    router.push({
      pathname: pathName,
      query: {
        sortBy: query.sortBy || "pop",
        page: query.page || 1,
      },
    });
  };
  if (isLoadingShop || isLoadingProduct) return <Loading />;
  if (!data || !shopData) return null;
  return (
    <div>
      <Seo
        data={{
          title: (data?.metadata && data.metadata.shop.name) || "",
          description: `Mua sắm online tại ${data.metadata.shop.name}`,
          url: "http://localhost:3000/",
          thumbnailUrl: data?.metadata && data.metadata.shop.avatar,
        }}
      />
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="">
        <div className=" bg-white py-5">
          <div className="container xl:px-0 px-5">
            <div className="flex md:flex-row flex-col gap-y-3">
              <div className="p-4 bg-orange/90 w-full w400:mx-auto md:mx-0  w400:w-80 rounded-sm">
                <div className="flex gap-x-3 ">
                  <div className="w-20 shrink-0">
                    <div className="w-full rounded-full overflow-hidden border border-gray  bg-white">
                      <Image
                        src={shopData.metadata.shop.avatar || ""}
                        width={80}
                        height={80}
                        alt=""
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="grow flex flex-col justify-between">
                    <h1 className="text-white text-xl">
                      {shopData.metadata.shop.name}
                    </h1>
                    {!shopData.metadata.shop.isFollowing && (
                      <button
                        onClick={handleFollow}
                        className="w-full border-white border text-xs text-white py-1"
                      >
                        + Theo Dõi
                      </button>
                    )}
                    {shopData.metadata.shop.isFollowing && (
                      <button
                        onClick={handleUnFollow}
                        className="w-full border-red border text-xs text-white bg-red py-1 "
                      >
                        Đang Theo
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="md:pl-10 gap-y-2 grid grid-cols-2 grow text-sm ">
                <div className="my-auto">
                  Sản phẩm:{" "}
                  <span className="text-red">
                    {shopData.metadata.shop.num_product}
                  </span>
                </div>
                <div className="my-auto">
                  Người Theo Dõi:{" "}
                  <span className="text-red">
                    {shopData.metadata.shop.followers}
                  </span>
                </div>
                <div className="my-auto">
                  Đánh Giá:{" "}
                  <span className="text-red">
                    {shopData.metadata.shop.rating === 0
                      ? "Chưa có đánh giá"
                      : shopData.metadata.shop.rating}
                  </span>
                </div>
                <div className="my-auto ">
                  Tham Gia:{" "}
                  <span className="text-red">
                    {timeSince(shopData.metadata.shop.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-5  container">
          <div className="flex">
            <div className="  w-[190px]   shrink-0 transition-all   lg:translate-x-0    p-0 hidden  lg:block col-span-2 lg:mr-2.5">
              <AsideFilter
                listCategory={
                  (shopData.metadata && shopData.metadata.categories) || []
                }
                query={query}
                pathName={pathName}
                nameRating="rating-3"
              />
              <div className="lg:hidden block">
                {productData?.metadata && (
                  <SortProductList
                    page={productData.metadata.pagination.page}
                    total_pages={productData.metadata.pagination.total_pages}
                    query={query}
                    pathName={pathName}
                  />
                )}
              </div>
              <button
                onClick={handleRemoveFilters}
                className="w-full h-8 opacity-90 mt-5 bg-orange text-white text-sm rounded-sm"
              >
                Xóa Tất cả
              </button>
            </div>

            <div className="grow  lg:ml-2.5">
              <div className="lg:block hidden ">
                {productData?.metadata && (
                  <SortProductList
                    page={productData.metadata.pagination.page}
                    total_pages={productData.metadata.pagination.total_pages}
                    query={query}
                    pathName={pathName}
                  />
                )}
              </div>

              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-y-2">
                {productData?.metadata &&
                  productData.metadata.products.map((product) => (
                    <Product product={product} key={product._id} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="drawer-side lg:hidden">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="bg-white   h-full w-[250px] p-3">
          <AsideFilter
            nameRating="rating-1"
            listCategory={
              (shopData.metadata && shopData.metadata.categories) || []
            }
            query={query}
            pathName={pathName}
          />
          <div>
            {productData?.metadata && (
              <SortProductList
                page={productData.metadata.pagination.page}
                total_pages={productData.metadata.pagination.total_pages}
                query={query}
                pathName={pathName}
              />
            )}
          </div>
          <button
            onClick={handleRemoveFilters}
            className="w-full h-8 opacity-90 mt-5 bg-orange text-white text-sm rounded-sm"
          >
            Xóa Tất cả
          </button>
        </div>
      </div>
    </div>
  );
}
ShopDetailPage.Layout = MainLayout;
