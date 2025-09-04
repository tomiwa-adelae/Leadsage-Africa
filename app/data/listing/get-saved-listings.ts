import "server-only";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireUser } from "../user/require-user";

export const getSavedListings = async (limit: number = 10) => {
  const { user } = await requireUser();

  const listings = await prisma.savedListing.findMany({
    where: {
      userId: user.id,
    },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      Listing: {
        select: {
          title: true,
          price: true,
          slug: true,
          photos: {
            select: {
              id: true,
              cover: true,
              src: true,
            },
          },
          Category: {
            select: {
              name: true,
              id: true,
              description: true,
              icon: true,
            },
          },
          savedListing: {
            where: {
              userId: user.id,
            },
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!listings) return notFound();

  return listings;
};

export type GetSavedListingsType = Awaited<
  ReturnType<typeof getSavedListings>
>[0];
