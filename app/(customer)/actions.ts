"use server";

import { ApiResponse } from "@/lib/types";
import { requireUser } from "../data/user/require-user";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const cancelLease = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    await prisma.lease.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    revalidatePath("/");

    return { status: "success", message: "Lease successfully cancelled" };
  } catch (error) {
    return { status: "error", message: "Failed to cancel lease agreement" };
  }
};
