import "server-only";
import { requireUser } from "../require-user";
import { prisma } from "@/lib/db";

export const getMyLeases = async () => {
  const { user } = await requireUser();

  const leases = await prisma.lease.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      depositStatus: true,
      createdAt: true,
      moveInDate: true,
      endDate: true,
      startDate: true,
      leaseId: true,
      status: true,
      tenantSignature: true,
      landlordSignature: true,
      Listing: {
        select: {
          id: true,
          title: true,
          address: true,
          city: true,
          state: true,
          country: true,
          price: true,
          paymentFrequency: true,
          photos: {
            select: {
              src: true,
              id: true,
              cover: true,
            },
          },
          User: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return leases;
};

export type GetMyLeasesType = Awaited<ReturnType<typeof getMyLeases>>[0];
