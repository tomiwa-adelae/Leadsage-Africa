import { prisma } from "@/lib/db";
import { requireUser } from "../user/require-user";
import type { Conversation } from "@/lib/types/messaging";

export async function getConversations(): Promise<Conversation[]> {
  const session = await requireUser();

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: session.user.id,
          isArchived: false,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
          attachments: true,
        },
      },
    },
    orderBy: {
      lastMessageAt: "desc",
    },
  });

  // Add unread count for current user and serialize dates
  return conversations.map((conv) => {
    const currentUserParticipant = conv.participants.find(
      (p) => p.userId === session.user.id
    );
    const otherParticipants = conv.participants.filter(
      (p) => p.userId !== session.user.id
    );

    const lastMessage = conv.messages[0];

    return {
      id: conv.id,
      type: conv.type,
      title: conv.title,
      bookingId: conv.bookingId,
      applicationId: conv.applicationId,
      leaseId: conv.leaseId,
      listingId: conv.listingId,
      participants: conv.participants.map((p) => ({
        id: p.id,
        conversationId: p.conversationId,
        userId: p.userId,
        role: p.role,
        unreadCount: p.unreadCount,
        lastReadAt: p.lastReadAt?.toISOString() || null,
        isMuted: p.isMuted,
        isArchived: p.isArchived,
        joinedAt: p.joinedAt.toISOString(),
        user: p.user,
      })),
      lastMessage: lastMessage
        ? {
            id: lastMessage.id,
            conversationId: lastMessage.conversationId,
            senderId: lastMessage.senderId,
            content: lastMessage.content,
            type: lastMessage.type,
            status: lastMessage.status,
            sender: {
              id: lastMessage.sender.id,
              name: lastMessage.sender.name,
              email: "",
              image: null,
            },
            attachments: lastMessage.attachments.map((att) => ({
              id: att.id,
              fileName: att.fileName,
              fileSize: att.fileSize,
              fileType: att.fileType,
              url: att.url,
              createdAt: att.createdAt.toISOString(),
            })),
            replyTo: null,
            replyToId: lastMessage.replyToId,
            readBy: [],
            editedAt: lastMessage.editedAt?.toISOString() || null,
            deletedAt: lastMessage.deletedAt?.toISOString() || null,
            createdAt: lastMessage.createdAt.toISOString(),
            updatedAt: lastMessage.updatedAt.toISOString(),
          }
        : null,
      lastMessageAt: conv.lastMessageAt?.toISOString() || null,
      unreadCount: currentUserParticipant?.unreadCount || 0,
      otherParticipants: otherParticipants.map((p) => ({
        id: p.id,
        conversationId: p.conversationId,
        userId: p.userId,
        role: p.role,
        unreadCount: p.unreadCount,
        lastReadAt: p.lastReadAt?.toISOString() || null,
        isMuted: p.isMuted,
        isArchived: p.isArchived,
        joinedAt: p.joinedAt.toISOString(),
        user: p.user,
      })),
      createdAt: conv.createdAt.toISOString(),
      updatedAt: conv.updatedAt.toISOString(),
    };
  });
}
