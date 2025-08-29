import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";

export const getNotifications = async () => {
  const { user } = await requireUser();

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      message: true,
      createdAt: true,
      status: true,
      type: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications;
};

export type GetNotificationsType = Awaited<
  ReturnType<typeof getNotifications>
>[0];
