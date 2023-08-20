export interface Cart {
  _id: string;
  cart_products: CartItem[];
}

export interface CartItem {
  product: {
    _id: string;
    product_name: string;
    product_thumb: string;
    product_price: number;
    product_quantity: number;
  };
  quantity: number;
  shop: {
    shop_name: string;
    _id: string;
  };
  _id: string;
}

export interface ExtendCartItem extends CartItem {
  checked: boolean;
}
