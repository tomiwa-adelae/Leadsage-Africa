"use server";

import { requireUser } from "@/app/data/user/require-user";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  editPasswordFormSchema,
  EditPasswordFormSchemaType,
} from "@/lib/zodSchemas";
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

    return { status: "success", message: "Password successfully created" };
  } catch (error) {
    return { status: "error", message: "Fail to create password" };
  }
};
