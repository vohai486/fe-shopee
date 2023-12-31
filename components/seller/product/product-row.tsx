import { Menus, Modal } from "@/components/common";
import { Checkbox } from "@/components/common/checkbox";
import Table from "@/components/common/table";
import { Product } from "@/types";
import { formatDate, formatPriceVND } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { FormProduct } from "./form-product";

export interface ProductRowProps {
  product: Product & { checked: boolean };
  handleChecked: (id: string, checked: boolean) => void;
  handleUnPublishProduct: (id: string) => void;
  handlePublishProduct: (id: string) => void;
}

export function ProductRow({
  product,
  handleChecked,
  handleUnPublishProduct,
  handlePublishProduct,
}: ProductRowProps) {
  const { query } = useRouter();
  return (
    <Table.Row>
      <div>
        <Checkbox
          aria-describedby="helper-checkbox-text"
          type="checkbox"
          name={product._id}
          checked={product.checked}
          id={product._id}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChecked(product._id, e.target.checked);
          }}
        />
      </div>
      <div className="flex gap-x-2">
        <Image src={product.product_thumb} alt="" width={80} height={80} />
        <div className=" grow">
          <p className="line-clamp-2">{product.product_name}</p>
        </div>
      </div>
      <div>{product.product_category.category_name}</div>
      <div>{product.product_brand}</div>
      <div>{formatPriceVND(product.product_price)}</div>
      <div>{formatDate(product.createdAt)}</div>
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={product._id} />
          <Modal.Window name={`edit-${product._id}`}>
            <FormProduct product={product} />
          </Modal.Window>
          <Menus.List id={product._id}>
            <Modal.Open opens={`edit-${product._id}`}>
              <Menus.Button
                icon={
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
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                }
                onClick={() => handleUnPublishProduct(product._id)}
              >
                Sửa sản phẩm
              </Menus.Button>
            </Modal.Open>

            {query.type === "published" && (
              <Menus.Button
                icon={
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
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                }
                onClick={() => handleUnPublishProduct(product._id)}
              >
                Ẩn sản phẩm
              </Menus.Button>
            )}
            {query.type === "draft" && (
              <Menus.Button
                icon={
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
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
                onClick={() => handlePublishProduct(product._id)}
              >
                Hiện sản phẩm
              </Menus.Button>
            )}
          </Menus.List>
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}
