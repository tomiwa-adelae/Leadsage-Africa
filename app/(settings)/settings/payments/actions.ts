"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  addPaymentMethodFormSchema,
  AddPaymentMethodFormSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

export const addPaymentMethod = async (
  data: AddPaymentMethodFormSchemaType,
  cardType: string
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = addPaymentMethodFormSchema.safeParse(data);

    if (!validation.success || !cardType)
      return { status: "error", message: "Invalid data type" };

    await prisma.paymentMethod.create({
      data: {
        ...validation.data,
        cardType,
        userId: user.id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Payment",
        color: "bg-green-600",
        title: `New payment method added`,
        message: `Your ${cardType} •••• ${validation.data.cardNumber.slice(
          -4
        )} has been successfully added to your account.`,
      },
    });

    revalidatePath("/notifications");
    revalidatePath("/settings");

    return { status: "success", message: "Payment method successfully saved" };
  } catch (error) {
    return { status: "error", message: "Fail to add payment method" };
  }
};

export const removePaymentMethod = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const method = await prisma.paymentMethod.findUnique({
      where: {
        id,
        userId: user.id,
      },
      select: {
        cardNumber: true,
        cardType: true,
      },
    });

    if (!method)
      return { status: "error", message: "Oops! An error occurred!" };

    await prisma.paymentMethod.delete({
      where: {
        id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Payment",
        color: "bg-red-600",
        title: `Payment method removed`,
        message: `Your ${method.cardType} •••• ${method.cardNumber.slice(
          -4
        )} has been removed from your account.`,
      },
    });

    revalidatePath("/notifications");
    revalidatePath("/settings");

    return {
      status: "success",
      message: "Payment method successfully removed",
    };
  } catch (error) {
    return { status: "error", message: "Failed to remove payment method" };
  }
};
