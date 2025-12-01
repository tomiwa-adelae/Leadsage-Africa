import { prisma } from "@/lib/db";
import { requireUser } from "../user/require-user";

export async function getMessages(
  conversationId: string,
  cursor?: string,
  limit: number = 50
) {
  const session = await requireUser();

  // Verify user is a participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: session.user.id,
      },
    },
  });

  if (!participant) {
    throw new Error("Not a participant in this conversation");
  }

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
      deletedAt: null,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      attachments: true,
      replyTo: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      readBy: {
        select: {
          userId: true,
          readAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit + 1,
    ...(cursor && {
      cursor: {
        id: cursor,
      },
      skip: 1,
    }),
  });

  const hasMore = messages.length > limit;
  const items = hasMore ? messages.slice(0, -1) : messages;

  return {
    messages: items.reverse(), // Return in chronological order
    nextCursor: hasMore ? items[items.length - 1]?.id : null,
    currentUserId: session.user.id,
  };
}
