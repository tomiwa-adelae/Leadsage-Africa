import "server-only";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireAdmin } from "../require-admin";

export const getPaymentDetails = async (id: string) => {
  await requireAdmin();

  if (!id) return notFound();

  const details = await prisma.payment.findUnique({
    where: {
      id,
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
          User: {
            select: {
              name: true,
              email: true,
              phoneNumber: true,
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
