import { prisma } from "@/lib/db";
import { requireUser } from "../user/require-user";

export async function getUnreadCount() {
  const session = await requireUser();

  const result = await prisma.conversationParticipant.aggregate({
    where: {
      userId: session.user.id,
      isArchived: false,
    },
    _sum: {
      unreadCount: true,
    },
  });

  return result._sum.unreadCount || 0;
}
