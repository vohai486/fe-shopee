import { SellerLayout } from "@/components/layouts";
import { SellerPortalLayout } from "@/components/layouts";
import Image from "next/image";
import Link from "next/link";

export default function PortalPage() {
  return (
    <div className="bg-white p-14 text-sm shadow-2xl rounded-lg">
      <div className="w-[352px] m-auto text-center flex flex-col items-center">
        <Image src="/img-seller.png" width={200} height={200} alt="" />
        <div className="mt-8 mb-4 text-xl">Chào mừng đến Bách Hóa!</div>
        <div className="mb-4 text-gray4">
          Để đăng ký bán hàng trên Shopee, bạn cần cung cấp một số thông tin cơ
          bản.
        </div>
        <Link
          href="/seller/portal/form"
          className="text-white bg-orange py-1 rounded-sm px-4"
        >
          Đăng ký
        </Link>
      </div>
    </div>
  );
}
PortalPage.Layout = SellerPortalLayout;
