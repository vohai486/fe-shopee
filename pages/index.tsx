import {
  categoryApi as categoryClient,
  productApi as productClient,
} from "@/api-client";
import {
  categoryApi as categoryServer,
  productApi as productServer,
} from "@/api-server";
import { Loading } from "@/components/common";
import { Seo } from "@/components/common/seo";
import { MainLayout } from "@/components/layouts";
import {
  AsideFilter,
  Product,
  SortProductList,
} from "@/components/product-list";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export default function Home() {
  const controller = new AbortController();
  const { query, pathname, push, isReady } = useRouter();
  const { isLoading, data: productData } = useQuery({
    queryKey: ["products", query],
    queryFn: () => {
      return productClient.getAll(query, controller.signal);
    },
    keepPreviousData: true,
    staleTime: 60,
    enabled: isReady,
  });
  const { data: categoryData } = useQuery({
    queryKey: ["category"],
    queryFn: () => {
      return categoryClient.getAll();
    },
    keepPreviousData: true,
    staleTime: 60 * 60 * 1000,
    enabled: isReady,
  });
  const handleRemoveFilters = () => {
    push({
      pathname,
      query: {
        sortBy: query.sortBy || "pop",
        page: query.page || 1,
      },
    });
  };
  if (!isReady || isLoading) {
    return <Loading />;
  }

  return (
    <div className="py-6 ">
      <Seo
        data={{
          title: "Mua sắm online",
          description: "Mua sắm online",
          url: "http://localhost:3000/",
          thumbnailUrl:
            "https://salt.tikicdn.com/cache/280x280/ts/product/00/7f/df/bc73a554a03590367c4e61268b32a3c2.jpg",
        }}
      />
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <div className="container drawer-content xl:px-0">
        <div className="flex">
          <div className="  w-[190px]   shrink-0 transition-all   lg:translate-x-0    p-0 hidden  lg:block col-span-2 lg:mr-2.5">
            <AsideFilter
              listCategory={(categoryData && categoryData.metadata) || []}
              query={query}
              nameRating="rating-2"
            />
            <button
              onClick={handleRemoveFilters}
              className="w-full h-8 opacity-90 mt-5 bg-orange text-white text-sm rounded-sm"
            >
              Xóa Tất cả
            </button>
          </div>
          <div className="grow">
            <div className="lg:block hidden">
              {productData?.metadata && (
                <SortProductList
                  page={productData.metadata.pagination.page}
                  total_pages={productData.metadata.pagination.total_pages}
                  query={query}
                />
              )}
            </div>
            {/* {isFetching ? (
              <div></div>
            ) : ( */}
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-y-2">
              {productData?.metadata &&
                productData.metadata.products.map((product) => (
                  <Product product={product} key={product._id} />
                ))}
            </div>
            {/* )} */}
          </div>
        </div>
      </div>
      <div className="drawer-side lg:hidden">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="bg-white   h-full w-[250px] p-3">
          <AsideFilter
            nameRating="rating-1"
            listCategory={(categoryData && categoryData.metadata) || []}
            query={query}
          />
          <div>
            {productData?.metadata && (
              <SortProductList
                page={productData.metadata.pagination.page}
                total_pages={productData.metadata.pagination.total_pages}
                query={query}
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

export async function getStaticProps() {
  const queryClient = new QueryClient();
  const queryClientCate = new QueryClient();
  queryClient.prefetchQuery({
    queryKey: ["products", {}],
    queryFn: () => {
      return productServer.getAll({});
    },
    staleTime: 60 * 60 * 1000,
  });
  queryClientCate.prefetchQuery(["category"], categoryServer.getAll);
  return {
    props: {
      initialProducts: dehydrate(queryClient),
      initialCategory: dehydrate(queryClientCate),
    },
  };
}

Home.Layout = MainLayout;
