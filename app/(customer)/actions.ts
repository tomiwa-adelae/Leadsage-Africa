"use server";

import { ApiResponse } from "@/lib/types";
import { requireUser } from "../data/user/require-user";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { PaymentStatus } from "@/lib/generated/prisma";

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

export const markLeaseAsPaid = async (
  id: string,
  amount: string,
  trxref: string,
  transaction: string,
  reference: string,
  status: PaymentStatus,
  method: string
) => {
  const { user } = await requireUser();

  try {
    const lease = await prisma.lease.findUnique({
      where: {
        id,
      },
    });

    if (!lease) return { status: "error", message: "Oops! An error occurred" };

    console.log(id, amount, trxref, reference, transaction, status, method);

    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        amount,
        leaseId: lease.id,
        type: "RENT",
        paidAt: new Date(),
        trxref,
        transaction,
        reference,
        status,
        method,
      },
    });

    await prisma.lease.update({
      where: {
        id,
      },
      data: {
        status: "ACTIVE",
      },
    });

    revalidatePath("/leases");

    if (!payment)
      return { status: "error", message: "Oops! An error occurred" };

    return {
      status: "success",
      message: "Lease payment successful",
      payment: payment,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to save lease payment. Please contact support",
    };
  }
};
