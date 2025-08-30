import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";

export const getPendingListings = async () => {
  await requireAdmin();

  const listings = await prisma.listing.findMany({
    where: {
      status: "Published",
      isApproved: false,
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
    },
  });

  return listings;
};

export type GetPendingListingsType = Awaited<
  ReturnType<typeof getPendingListings>
>[0];
