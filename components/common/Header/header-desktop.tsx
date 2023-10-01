import { cartApi } from "@/api-client/cart-api";
import { InputField } from "@/components/form/input-field";
import { useAuth, useNotification } from "@/hooks";
import { formatPriceVND } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Logo from "../logo";
import dynamic from "next/dynamic";
const DarkModeToggle = dynamic(() => import("../dark-mode-toggle"), {
  ssr: false,
});
export interface filter {
  keyword: string;
}

export function HeaderDesktop() {
  const router = useRouter();
  const { profile, isLoading, isFetching, logout } = useAuth();
  const { data } = useQuery({
    queryKey: ["carts"],
    queryFn: () => cartApi.getCart(),
    enabled: !!profile?._id,
    staleTime: 3 * 60 * 1000,
  });
  const {
    listNotify,
    numberIsNotRead,
    handleMarkReadAllNotify,
    handleMarkReadNotify,
  } = useNotification("user");
  const { control, setValue, handleSubmit } = useForm<filter>({
    defaultValues: {
      keyword: "",
    },
    mode: "onChange",
  });
  const handleSearch = (values: filter) => {
    router.push({
      pathname: "/",
      query: {
        ...router.query,
        keyword: values.keyword.replace(/ /g, "%"),
      },
    });
    setValue("keyword", "");
  };
  const handleLogout = async () => {
    await logout();
  };
  return (
    <header className="bg-header border-b shadow-sm-50">
      <div className="container px-2 text-sm">
        <nav className="flex items-center justify-between py-2 ">
          <div>
            <Link href="/seller/dashboard">Kênh Người Bán</Link>
          </div>
          <div className="flex gap-2">
            <DarkModeToggle />
            {!isLoading &&
              (profile ? (
                <div className="flex cursor-pointer items-center gap-x-3">
                  <Link
                    href="/user/notifications"
                    className="group parent relative"
                  >
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
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                      />
                    </svg>
                    {listNotify.length > 0 && (
                      <>
                        {numberIsNotRead > 0 && (
                          <div className="absolute bg-brand-50  text-grey-0 bg-blue-200 text-xs -top-[5px] -right-[7px] rounded-full px-1 py-0 flex items-center justify-center">
                            {numberIsNotRead}
                          </div>
                        )}
                        <div className=" sm:block hidden absolute transition-all max-h-[300px] overflow-y-auto custom-scrollbar  h-0 group-hover:opacity-100 overflow-hidden  group-hover:h-[unset]  top-5 right-0 z-10">
                          <div className=" border bg-box border-box  w-[280px] rounded-sm ">
                            <div className="p-3 text-blue-200 font-medium text-right">
                              <span onClick={handleMarkReadAllNotify}>
                                Đánh dấu đã đọc tất cả
                              </span>
                            </div>
                            {listNotify.map((notify) => (
                              <Link
                                key={notify._id}
                                href={`/user/purchase/${notify.noti_options.orderId}`}
                                className={`py-3 px-4 border-t border-box block  hover:opacity-70 ${
                                  !notify.noti_isRead
                                    ? " bg-box"
                                    : "bg-grey-400 dark:bg-blue-600"
                                }`}
                                onClick={() =>
                                  !notify.noti_isRead &&
                                  handleMarkReadNotify(notify._id)
                                }
                              >
                                {notify.noti_content}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </Link>
                  <div className="flex group parent items-end relative gap-x-1 cursor-pointer">
                    {profile.avatar ? (
                      <Image
                        width={100}
                        height={100}
                        alt=""
                        src={profile.avatar}
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          borderRadius: "100%",
                        }}
                      />
                    ) : (
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
                          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                    <span className="line-clamp-1 w-[100px] w400:w-auto">
                      {profile?.fullName}
                    </span>
                    <div className="absolute text-sm transition-all text-black-100 dark:text-grey-300 h-0 group-hover:opacity-100 overflow-hidden  group-hover:h-[unset]  top-5 right-0 z-10">
                      <div className=" shadow-sm-50 bg-box border border-box w-[160px] rounded-sm ">
                        <Link
                          href="/user/profile"
                          className="py-3 px-4  border-b border-box  block  hover:bg-blue-200 dark:hover:text-grey-0 hover:text-grey-0  "
                        >
                          Tài Khoản Của Tôi
                        </Link>
                        <Link
                          href="/user/purchase"
                          className="py-3 px-4  border-b border-box block  hover:bg-blue-200 dark:hover:text-grey-0 hover:text-grey-0  "
                        >
                          Đơn Hàng
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="py-3 w-full   px-4 block text-left  hover:bg-blue-200 dark:hover:text-grey-0 hover:text-grey-0  "
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link href="/signup">Đăng Ký</Link>
                  <div className="mx-3">|</div>
                  <Link href="/login">Đăng Nhập</Link>
                </>
              ))}
          </div>
        </nav>
        <div className="sm:pt-0 pt-2.5 pb-2.5  flex flex-col sm:flex-row sm:gap-0 gap-4">
          <Link href="/" className="flex justify-center items-center sm:w-28">
            <Logo />
          </Link>
          <div className="flex grow ">
            <form
              onSubmit={handleSubmit(handleSearch)}
              className="grow mx-1 sm:ml-4 relative"
            >
              <div className="flex rounded-sm h-full">
                <InputField
                  classParent="w-full"
                  control={control}
                  name="keyword"
                  className="w-full h-full bg-inherit outline-none border  px-3 pr-10"
                  placeholder="Tìm kiếm Bách Hóa"
                />
                <button
                  type="submit"
                  className="absolute focus:outline-none right-3 flex justify-center h-full rounded-sm items-center "
                >
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
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </button>
              </div>
            </form>
            <Link
              href="/cart"
              className="sm:w-20 w-12 parent group parent  flex justify-center items-center cursor-pointer relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="sm:w-8 sm:h-8 w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              <div className="absolute z-20 rounded-sm shadow-2xl group-hover:block hidden top-full -right-2 sm:right-0 bg-box">
                <div className="w-[300px] sm:w-[400px]">
                  <ul>
                    {data?.metadata &&
                      data.metadata.cart_products.map((item) => (
                        <li key={item._id}>
                          <div className="p-3 flex justify-between w-full gap-x-2">
                            <div className="flex gap-x-2 truncate">
                              <Image
                                src={item.product.product_thumb}
                                width={40}
                                height={40}
                                alt=""
                              />
                              <div className="text-sm truncate ">
                                {item.product.product_name}
                              </div>
                            </div>
                            <div className="text-sm text-orange shrink-0">
                              {formatPriceVND(item.product.product_price)}
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              {data?.metadata && data.metadata.cart_products?.length > 0 && (
                <div className="absolute top-0 right-0 sm:right-4 py-0 px-1 text-xs border border-blue-200  bg-blue-200 text-grey-0 rounded-full text-orange">
                  {data?.metadata.cart_products.length}
                </div>
              )}
            </Link>
            <label
              htmlFor="my-drawer"
              className=" bg-transparent cursor-pointer lg:hidden  my-auto"
            >
              <svg
                className="swap-off sm:w-8 sm:h-8 w-7 h-7 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>
            </label>
          </div>
        </div>
      </div>
    </header>
  );
}
