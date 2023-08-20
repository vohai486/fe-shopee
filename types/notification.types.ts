export interface Notification {
  _id: string;
  noti_content: string;
  noti_options: {
    orderId: string;
  };
  noti_isRead: boolean;
}
