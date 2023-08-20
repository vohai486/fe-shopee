import { STATUS_ORDER } from "@/constants";
import { ExtendCartItem } from "@/types/cart.types";

export function formatPriceVND(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
export const generateTitleByOrderStatus = (status: string) => {
  if (status === STATUS_ORDER.PENDING) {
    return {
      title: "Đơn hàng đang được chờ xác nhận",
      label: "Chờ xác nhận",
    };
  }
  if (status === STATUS_ORDER.CONFIRMED) {
    return {
      title: "Đơn hàng đang được chờ xử lý",
      label: "Chờ xử lý",
    };
  }
  if (status === STATUS_ORDER.SHIPPED) {
    return {
      title: "Đơn hàng đang được giao",
      label: "đang giao",
    };
  }
  if (status === STATUS_ORDER.DELIVERED) {
    return {
      title: "Đơn hàng đã được giao thành công",
      label: "hoàn thành",
    };
  }
  if (status === STATUS_ORDER.CANCELLED) {
    return {
      title: "Đơn hàng đã được hủy",
      label: "đã hủy",
    };
  }
  return {
    title: "",
    label: "",
  };
};
export function formatPrice(price: number) {
  if (!price) return;
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
export const removeSpecialCharacter = (str: string) =>
  str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ""
  );

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, "-") + `-i-${id}`;
};

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split("-i-");
  return arr[arr.length - 1];
};

export const collectListByShop = (
  arr: ExtendCartItem[]
): ExtendCartItem[][] => {
  const mapList = new Map<string, ExtendCartItem[]>();
  arr.forEach((item) => {
    if (!mapList.has(item.shop._id)) {
      mapList.set(item.shop._id, [item]);
    } else {
      mapList.set(item.shop._id, [
        ...(mapList.get(item.shop._id) as ExtendCartItem[]),
        item,
      ]);
    }
  });

  return Array.from(mapList.values());
};

export const formatDateVoucher = (
  dateString: Date
): {
  type: "expire" | "aboutToExpire" | "readyUse";
  value: string | number;
} => {
  const date = new Date(dateString);
  const currentTime = new Date();
  const currentTimePlus24Hours = new Date(
    currentTime.getTime() + 24 * 60 * 60 * 1000
  );
  if (currentTime > date) {
    return {
      type: "expire",
      value: "",
    };
  }
  if (currentTimePlus24Hours >= date && date > currentTime) {
    return {
      type: "aboutToExpire",
      value: Math.round(
        Math.abs(date.valueOf() - currentTime.valueOf()) / (1000 * 60 * 60)
      ),
    };
  }
  return {
    type: "readyUse",
    value:
      `0${date.getDate()}`.slice(-2) +
      "." +
      `0${date.getMonth() + 1}`.slice(-2) +
      "." +
      `${date.getFullYear()}`,
  };
};
export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  const hour = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  return `${day}/${month}/${year} - ${hour}:${minutes}`;
};

export function timeSince(date: Date) {
  if (!date) return "";
  // current Time - date
  const now = new Date();
  const yourDate = new Date(date);
  const seconds = Math.floor((now.getTime() - yourDate.getTime()) / 1000); // in ra số giây

  let timer = seconds / 31536000; // 0.00002342
  if (timer > 1) {
    return `${Math.floor(timer)} năm`;
  }
  timer = seconds / 2678400; // 0.0023424
  if (timer > 1) {
    return `${Math.floor(timer)} tháng`;
  }
  timer = seconds / 604800; // 0.023423
  if (timer > 1) {
    return `${Math.floor(timer)} tuần`;
  }
  timer = seconds / 86400; // 0.9
  if (timer > 1) {
    return `${Math.floor(timer)} ngày`;
  }
  timer = seconds / 3600; // 1.333
  if (timer > 1) {
    return `${Math.floor(timer)} giờ`;
  }
  timer = seconds / 60;
  if (timer > 1) {
    return `${Math.floor(timer)} phút`;
  }
  return "vừa xong";
}

export function getStatusOrder(status: string) {
  if (status === STATUS_ORDER.PENDING) {
    return "Chờ xác nhận";
  }
  if (status === STATUS_ORDER.CONFIRMED) {
    return "Chờ lấy hàng";
  }
  if (status === STATUS_ORDER.SHIPPED) {
    return "Đang giao";
  }
  if (status === STATUS_ORDER.CANCELLED) {
    return "Đã Hủy";
  }
  return "Hoàn Thành";
}
export function getObjectKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}
export function getDayMonthYear(dateString: Date) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${day}/${month}/${year}`;
}
export function getDateAgo(day: number) {
  const currentDate = new Date();
  const resultDate = new Date(currentDate);
  resultDate.setDate(currentDate.getDate() - day);
  return new Date(resultDate);
}
