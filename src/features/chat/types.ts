export interface Message {
  senderEmail: string;
  senderName?: string;
  senderRole?: string | null;
  receiverEmail: string;
  message: string;
  imageUrl?: string | null;
  conversationId: string;
  timestamp?: string;
  isRead?: boolean;
}

export interface Conversation {
  _id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount?: number;
}
