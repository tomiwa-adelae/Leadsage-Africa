import "server-only";
import { requireUser } from "../require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getPaymentDetails = async (id: string) => {
  const { user } = await requireUser();

  if (!id) return notFound();

  const details = await prisma.payment.findUnique({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
      amount: true,
      createdAt: true,
      paidAt: true,
      type: true,
      reference: true,
      trxref: true,
      transaction: true,
      status: true,
      method: true,
      User: {
        select: {
          name: true,
        },
      },
      Lease: {
        select: {
          leaseId: true,
          moveInDate: true,
          startDate: true,
          endDate: true,
          Listing: {
            select: {
              address: true,
              city: true,
              state: true,
              country: true,
              title: true,
              paymentFrequency: true,
              Category: {
                select: {
                  name: true,
                },
              },
              User: {
                select: {
                  name: true,
                  email: true,
                  phoneNumber: true,
                },
              },
              photos: {
                select: {
                  cover: true,
                  src: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!details) return notFound();

  return details;
};
export type GetPaymentDetailsType = Awaited<
  ReturnType<typeof getPaymentDetails>
>;
