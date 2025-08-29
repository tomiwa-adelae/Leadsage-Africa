"use server";

import { requireUser } from "@/app/data/user/require-user";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  editPasswordFormSchema,
  EditPasswordFormSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const triggerUpdateUser = async (): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Security",
        color: "bg-yellow-500",
        title: "Your password has been changed",
        message: `You successfully updated your account password. If this wasn’t you, reset your password immediately or contact support.`,
      },
    });

    revalidatePath("/notifications");
    return { status: "success", message: "Update successful" };
  } catch (error) {
    return { status: "error", message: "Failed to update user" };
  }
};

export const triggerSocialNotification = async (
  social: string
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Security",
        color: "bg-red-600",
        title: `Sign-in method removed`,
        message: `You disconnected your ${social} account from sign-in. You’ll no longer be able to use ${social} to access your account.`,
      },
    });

    revalidatePath("/notifications");
    return { status: "success", message: "Update successful" };
  } catch (error) {
    return { status: "error", message: "Failed to update user" };
  }
};

export const createPassword = async (
  data: EditPasswordFormSchemaType,
  token: string | undefined
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editPasswordFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await auth.api.setPassword({
      body: {
        newPassword: validation.data.newPassword,
      },
      headers: await headers(),
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Security",
        color: "bg-yellow-500",
        title: "Your password has been created",
        message: `You successfully created your account password. If this wasn’t you, reset your password immediately or contact support.`,
      },
    });

    revalidatePath("/notifications");

    return { status: "success", message: "Password successfully created" };
  } catch (error) {
    return { status: "error", message: "Fail to create password" };
  }
};
