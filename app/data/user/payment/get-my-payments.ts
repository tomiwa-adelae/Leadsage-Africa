import "server-only";
import { requireUser } from "../require-user";
import { prisma } from "@/lib/db";

export const getMyPayments = async () => {
  const { user } = await requireUser();

  const payments = await prisma.payment.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      amount: true,
      createdAt: true,
      type: true,
      status: true,
      paidAt: true,
      method: true,
      reference: true,
      trxref: true,
      User: {
        select: {
          name: true,
        },
      },
      Lease: {
        select: {
          id: true,
          leaseId: true,
          Listing: {
            select: {
              title: true,
              slug: true,
              smallDescription: true,
              bedrooms: true,
              bathrooms: true,
              propertySize: true,
              state: true,
              address: true,
              city: true,
              country: true,
              price: true,
              securityDeposit: true,
              paymentFrequency: true,
              availabilityDate: true,
              petPolicy: true,
              smokingPolicy: true,
              partyPolicy: true,
              additionalPolicies: true,
              Category: {
                select: {
                  id: true,
                  name: true,
                },
              },
              amenities: {
                select: {
                  id: true,
                  description: true,
                  icon: true,
                  name: true,
                },
              },
              photos: {
                select: {
                  id: true,
                  src: true,
                  cover: true,
                },
              },
              User: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  email: true,
                  phoneNumber: true,
                  gender: true,
                  address: true,
                  city: true,
                  state: true,
                  country: true,
                  createdAt: true,
                  emailVerified: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return payments;
};

export type GetMyPaymentsType = Awaited<ReturnType<typeof getMyPayments>>[0];
