import { Address } from "./address.types";
import { Product } from "./product.types";

export interface ReviewOrder {
  checkout_order: {
    feeShip: number;
    totalCheckout: number;
    totalDiscount: number;
    totalPrice: number;
  };
  shop_order_ids_new: {
    feeShip: number;
    itemProducts: {
      price: number;
      productId: string;
      productTotal: number;
      quantity: number;
      name: string;
      thumb: string;
      countStock: number;
      checkStock: boolean;
    }[];
    priceApplyDiscount: number;
    priceDiscount: number;
    priceRaw: number;
    totalCheckout: number;
    shop: {
      id: string;
      name: string;
    };
  }[];
}

export interface Order {
  createdAt: Date;
  order_checkout: {
    totalPrice: number;
    feeShip: number;
    totalCheckout: number;
    totalDiscount: number;
  };
  order_products: {
    price: number;
    quantity: number;
    product: {
      product_name: string;
      product_thumb: string;
      _id: string;
    };
  }[];
  order_shop: {
    _id: string;
    shop_name: string;
    shop_avatar: string;
  };
  order_status: string;
  updatedAt: Date;
  _id: string;
  order_paidAt: Date;
  order_isPaid: boolean;
  order_deliveredAt: Date;
  order_payment: { type: string };
  order_user: {
    fullName: string;
    _id: string;
    avatar: string;
  };
  order_shipping: Address;
}
