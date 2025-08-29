"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const deleteNotification = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    await prisma.notification.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    revalidatePath("/notifications");

    return { status: "success", message: "Notification deleted" };
  } catch (error) {
    return { status: "error", message: "Failed to delete notification" };
  }
};
