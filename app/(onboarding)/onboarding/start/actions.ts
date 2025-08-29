"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const selectRole = async (role: string): Promise<ApiResponse> => {
  const { user } = await requireUser();
  try {
    if (!role) return { status: "error", message: "Invalid role data" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Success",
        color: "bg-blue-400",
        title: `Role selected`,
        message: `You’ve chosen to continue as a ${role}. Your dashboard is now tailored for your needs.`,
      },
    });

    revalidatePath("/notifications");

    return {
      status: "success",
      message: "Your role has been successfully updated. Redirecting...",
    };
  } catch (error) {
    return { status: "error", message: "Failed to save role" };
  }
};
