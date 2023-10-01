import { SellerLayout } from "@/components/layouts";
import { ProductTable, ProductTableOperations } from "@/components/seller";
import Script from "next/script";

export interface IProps {}

export default function ProductSellerPage(props: IProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-title font-semibold">Sản phẩm</h1>
        <ProductTableOperations />
      </div>
      <ProductTable />
      <Script
        strategy="afterInteractive"
        src="https://upload-widget.cloudinary.com/global/all.js"
      ></Script>
    </>
  );
}
ProductSellerPage.Layout = SellerLayout;
