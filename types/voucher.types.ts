export interface Voucher {
  _id: string;
  voucher_code: string;
  voucher_name: string;
  voucher_type: string;
  voucher_value: number;
  voucher_end_date: Date;
  voucher_max_uses: number;
  voucher_user_count: number;
  voucher_min_order_value: number;
  is_apply: boolean;
  is_use: boolean;
  voucher_start_date: Date;
  voucher_max_uses_per_user: number;

  codeRetentionTime: number;
  numUsed: number;
  status: "happenning" | "upcoming" | "finished";
}

export type VoucherPayload = Pick<
  Voucher,
  "_id" | "voucher_code" | "voucher_value" | "voucher_min_order_value"
> & { shopId: string };

export type PayloadAddVoucher = Pick<
  Voucher,
  | "voucher_code"
  | "voucher_end_date"
  | "voucher_name"
  | "voucher_value"
  | "voucher_min_order_value"
  | "voucher_start_date"
  | "voucher_max_uses"
  | "voucher_max_uses_per_user"
>;
