import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";

export const getArchivedListings = async () => {
  await requireAdmin();

  const listings = await prisma.listing.findMany({
    where: {
      status: "Archived",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      price: true,
      isApproved: true,
      photos: {
        select: {
          id: true,
          src: true,
          cover: true,
        },
      },
      Lease: {
        where: {
          status: "ACTIVE",
        },
        select: {
          status: true,
        },
      },
    },
  });

  return listings;
};

export type GetArchivedListingsType = Awaited<
  ReturnType<typeof getArchivedListings>
>[0];
