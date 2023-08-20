export interface Message {
  createdAt: string;
  message_content: string;
  message_conversationId: string;
  message_reacts: [string];
  message_type: string;
  message_userId: string;
  updatedAt: Date;
  _id: string;
}

export interface ResponseMessage {
  messages: Message[];
  isSeen: boolean;
  lastView: Date;
}
