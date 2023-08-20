export interface InventoryManage {
  inven_productId: {
    product_name: string;
    product_thumb: string;
    _id: string;
  };
  inven_stock: number;
  sell_7_days: number;
  sell_30_days: number;
  _id: string;
}
