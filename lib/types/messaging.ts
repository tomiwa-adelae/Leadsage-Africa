export interface MessageUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  createdAt: string;
}

export interface MessageRead {
  userId: string;
  readAt: string;
}

export interface ReplyToMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
  status: "PENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED";
  sender: MessageUser;
  attachments: MessageAttachment[];
  replyTo: ReplyToMessage | null;
  replyToId: string | null;
  readBy: MessageRead[];
  editedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  role: "MEMBER" | "ADMIN" | "ARCHIVED";
  unreadCount: number;
  lastReadAt: string | null;
  isMuted: boolean;
  isArchived: boolean;
  joinedAt: string;
  user: MessageUser;
}

export interface Conversation {
  id: string;
  type: "DIRECT" | "BOOKING" | "APPLICATION" | "LEASE" | "LISTING" | "SUPPORT";
  title: string | null;
  bookingId: string | null;
  applicationId: string | null;
  leaseId: string | null;
  listingId: string | null;
  participants: ConversationParticipant[];
  lastMessage: Message | null;
  lastMessageAt: string | null;
  unreadCount: number;
  otherParticipants: ConversationParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface MessagesResponse {
  messages: Message[];
  nextCursor: string | null;
  currentUserId: string;
}

export interface CreateConversationPayload {
  participantIds: string[];
  type?: Conversation["type"];
  title?: string;
  bookingId?: string;
  applicationId?: string;
  leaseId?: string;
  listingId?: string;
  initialMessage?: string;
}

export interface SendMessagePayload {
  content: string;
  type?: Message["type"];
  replyToId?: string;
  attachments?: Omit<MessageAttachment, "id" | "createdAt">[];
}
