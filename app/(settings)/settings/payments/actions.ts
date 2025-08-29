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

    revalidatePath("/settings");

    return { status: "success", message: "Payment method successfully saved" };
  } catch (error) {
    return { status: "error", message: "Fail to add payment method" };
  }
};
