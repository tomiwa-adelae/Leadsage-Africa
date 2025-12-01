import { prisma } from "@/lib/db";
import { requireUser } from "../user/require-user";
import { notFound } from "next/navigation";

export async function getConversation(conversationId: string) {
  const session = await requireUser();

  // First verify user is a participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: session.user.id,
      },
    },
  });

  if (!participant) {
    notFound();
  }

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
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
    },
  });

  if (!conversation) {
    notFound();
  }

  const otherParticipants = conversation.participants.filter(
    (p) => p.userId !== session.user.id
  );

  return {
    ...conversation,
    currentUserId: session.user.id,
    otherParticipants,
  };
}
