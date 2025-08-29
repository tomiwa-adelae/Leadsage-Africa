"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const saveBookingNotifications = async (
  value: boolean
): Promise<ApiResponse> => {
  const { user } = await requireUser();
  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        bookingNotifications: value,
      },
    });

    revalidatePath("/settings");

    return { status: "success", message: "Notification saved" };
  } catch (error) {
    return { status: "error", message: "Fail to save" };
  }
};

export const saveListingNotifications = async (
  value: boolean
): Promise<ApiResponse> => {
  const { user } = await requireUser();
  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        listingNotifications: value,
      },
    });

    revalidatePath("/settings");

    return { status: "success", message: "Notification saved" };
  } catch (error) {
    return { status: "error", message: "Fail to save" };
  }
};

export const savePromotionalNotifications = async (
  value: boolean
): Promise<ApiResponse> => {
  const { user } = await requireUser();
  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        promotionalNotifications: value,
      },
    });

    revalidatePath("/settings");

    return { status: "success", message: "Notification saved" };
  } catch (error) {
    return { status: "error", message: "Fail to save" };
  }
};

export const saveAccountNotifications = async (
  value: boolean
): Promise<ApiResponse> => {
  const { user } = await requireUser();
  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        accountNotifications: value,
      },
    });

    revalidatePath("/settings");

    return { status: "success", message: "Notification saved" };
  } catch (error) {
    return { status: "error", message: "Fail to save" };
  }
};
