import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "../require-admin";

export const getAllNotifications = async () => {
  const { user } = await requireAdmin();

  const notifications = await prisma.notification.findMany({
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
  ReturnType<typeof getAllNotifications>
>[0];
