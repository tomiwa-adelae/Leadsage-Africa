import "server-only";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getApprovedListings = async (
  limit: number = 10,
  userId?: string
) => {
  const listing = await prisma.listing.findMany({
    where: {
      isApproved: true,
      Lease: {
        none: {
          status: "ACTIVE",
        },
      },
    },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      smallDescription: true,
      price: true,
      discount: true,
      address: true,
      state: true,
      city: true,
      country: true,
      postalCode: true,
      Category: {
        select: {
          name: true,
          id: true,
          description: true,
          icon: true,
        },
      },
      photos: {
        select: {
          id: true,
          cover: true,
          src: true,
        },
      },
      savedListing: {
        where: {
          userId,
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!listing) return notFound();

  return listing;
};

export type GetApprovedListingsType = Awaited<
  ReturnType<typeof getApprovedListings>
>;
