"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  editProfileFormSchema,
  EditProfileFormSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

export const editProfile = async (
  data: EditProfileFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();
  try {
    const validation = editProfileFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid form data" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Success",
        color: "bg-blue-400",
        title: `Onboarding complete`,
        message: `Great job! You’ve completed your onboarding. You can now start exploring and using your dashboard.`,
      },
    });

    revalidatePath("/notifications");

    return {
      status: "success",
      message: "Your profile has been successfully updated. Redirecting...",
    };
  } catch (error) {
    return { status: "error", message: "Failed to update profile." };
  }
};
