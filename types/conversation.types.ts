export interface Conversation {
  isSeen: boolean;
  message: {
    _id: string;
    message_content: string;
    message_type: string;
    createdAt: Date;
  };
  user: {
    _id: string;
    avatar: string;
    fullName: string;
  };
  _id: string;
}
export type SelectedConversation = Pick<Conversation, "_id" | "user">;
