import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";

export const getTotalListings = async () => {
  await requireAdmin();

  const listings = await prisma.listing.findMany({
    where: {
      status: {
        not: "Deleted",
      },
    },
    select: {
      id: true,
      amenities: true,
      title: true,
      price: true,
      slug: true,
      isApproved: true,
      status: true,
      photos: {
        select: {
          id: true,
          src: true,
          cover: true,
        },
      },
    },
  });

  return listings;
};

export type GetTotalListingsType = Awaited<
  ReturnType<typeof getTotalListings>
>[0];
