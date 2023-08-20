import { Category } from "./category.types";
import { Pagination, ProductSelect } from "./product.types";

export interface ShopResponse {
  shop: {
    followers: number;
    rating: number;
    name: string;
    avatar: string;
    id: string;
    isFollowing: boolean;
    num_product: number;
    createdAt: Date;
  };
  categories: Category[];
}
