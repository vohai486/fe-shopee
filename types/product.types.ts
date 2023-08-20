export interface Product {
  _id: string;
  product_name: string;
  product_thumb: string;
  product_images: string[];
  product_description: string;
  product_originalPrice: number;
  product_discount: number;
  product_quantity: number;
  product_category: {
    category_name: string;
    _id: string;
  };
  product_shop: {
    shop_name: string;
    _id: string;
    shop_avatar: string;
    shop_ratingsAverage: number;
    shop_followers: number;
  };
  product_specifications?: { key: string; value: string }[];
  product_size?: Object;

  product_brand: string;
  product_ratingsAverage: number;
  product_reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  product_slug: string;
  product_price: number;
  product_quantity_sold: number;
}

export interface Pagination {
  total_pages: number;
  page: number;
  limit: number;
}

export type ProductSelect = Pick<
  Product,
  | "_id"
  | "product_name"
  | "product_thumb"
  | "product_discount"
  | "product_originalPrice"
  | "product_quantity_sold"
  | "product_ratingsAverage"
  | "product_price"
>;
