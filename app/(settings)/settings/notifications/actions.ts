"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { ApiResponse } from "@/lib/types";
import { kycFormSchemaType } from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

export const saveBookingNotifications = async (
  value: boolean,
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
  value: boolean,
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
  value: boolean,
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
  value: boolean,
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

export const processKycAndCreateWallet = async (
  data: kycFormSchemaType,
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const dbUser = await prisma.user.findUnique({ where: { id: user?.id } });

    if (!dbUser) return { status: "error", message: "User not found" };

    await prisma.user.update({
      where: { id: user?.id },
      data: { kycTier: 1 },
    });

    await prisma.kyc.upsert({
      where: { userId: user.id },
      update: {
        dateOfBirth: data.dob,
        idType: data.idType,
        idNumber: data.idNumber,
        status: "PENDING",
      },
      create: {
        userId: user.id,
        dateOfBirth: data.dob,
        idType: data.idType,
        idNumber: data.idNumber,
        status: "PENDING",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/shortlets/payment");

    return {
      status: "success",
      message: "Identity verified! You can now proceed to payment.",
    };
  } catch (error) {
    console.error("KYC_WALLET_ERROR", error);
    return {
      status: "error",
      message: "A technical error occurred. Please try again.",
    };
  }
};
