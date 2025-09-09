"use server";

import { ApiResponse } from "@/lib/types";
import { requireUser } from "../data/user/require-user";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { PaymentStatus } from "@/lib/generated/prisma";

import Mailjet from "node-mailjet";
import { env } from "@/lib/env";
import { paymentSuccessUser } from "@/lib/emails/payment-success-user";
import { paymentSuccessAdmin } from "@/lib/emails/payment-success-admin";
import { leaseActiveUser } from "@/lib/emails/lease-active-user";
const mailjet = Mailjet.apiConnect(
  env.MAILJET_API_PUBLIC_KEY,
  env.MAILJET_API_PRIVATE_KEY
);

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
      select: {
        id: true,
        startDate: true,
        endDate: true,
        leaseId: true,
        Listing: {
          select: {
            title: true,
            price: true,
          },
        },
      },
    });

    if (!lease) return { status: "error", message: "Oops! An error occurred" };

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

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Africa",
          },
          To: [
            {
              Email: user.email,
              Name: user.name,
            },
          ],
          ReplyTo: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Support",
          },
          Subject: `Leadsage Africa – Payment Successful`,
          TextPart: `Leadsage Africa – Payment Successful`,
          HTMLPart: paymentSuccessUser({
            amount,
            property: lease.Listing.title,
            reference,
            userName: user.name,
          }),
        },
      ],
    });

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Africa",
          },
          To: [
            {
              Email: env.ADMIN_EMAIL_ADDRESS,
              Name: "Leadsage Africa Admin",
            },
          ],
          ReplyTo: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Support",
          },
          Subject: `Leadsage Africa – User Payment Notification`,
          TextPart: `Leadsage Africa – User Payment Notification`,
          HTMLPart: paymentSuccessAdmin({
            amount,
            property: lease.Listing.title,
            reference,
            userName: user.name,
            id: payment.id,
          }),
        },
      ],
    });

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Africa",
          },
          To: [
            {
              Email: user.email,
              Name: user.name,
            },
          ],
          ReplyTo: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Support",
          },
          Subject: `Leadsage Africa – Lease Activation`,
          TextPart: `Leadsage Africa – Lease Activation`,
          HTMLPart: leaseActiveUser({
            property: lease.Listing.title!,
            userName: user.name,
            endDate: lease.endDate,
            id: lease.leaseId,
            rent: lease.Listing.price!,
            startDate: lease.startDate,
          }),
        },
      ],
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
