import { SellerLayout } from "@/components/layouts";
import { SellerPortalLayout } from "@/components/layouts";
import Image from "next/image";
import Link from "next/link";

export default function PortalPage() {
  return (
    <div className="bg-box border border-box  p-14 text-sm shadow-sm-50 rounded-md">
      <div className="w-[352px] m-auto text-center flex flex-col items-center">
        <Image src="/img-seller.png" width={200} height={200} alt="" />
        <div className="mt-8 mb-4 text-xl font-bold text-title">
          Chào mừng đến Bách Hóa!
        </div>
        <div className="mb-4 text-sm">
          Để đăng ký bán hàng, bạn cần cung cấp một số thông tin cơ bản.
        </div>
        <Link
          href="/seller/portal/form"
          className="text-grey-0 bg-blue-200 py-1 rounded-sm px-4"
        >
          Đăng ký
        </Link>
      </div>
    </div>
  );
}
PortalPage.Layout = SellerPortalLayout;
