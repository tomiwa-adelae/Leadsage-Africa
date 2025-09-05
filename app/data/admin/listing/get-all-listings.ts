import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";

export const getTotalListings = async ({ query, page = 1, limit }: Params) => {
  await requireAdmin();

  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [listings, totalCount] = await Promise.all([
    prisma.listing.findMany({
      where: {
        status: {
          not: "Deleted",
        },
        ...(query
          ? {
              OR: [
                { listingId: { contains: query, mode: "insensitive" } },
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { smallDescription: { contains: query, mode: "insensitive" } },
                { address: { contains: query, mode: "insensitive" } },
                { city: { contains: query, mode: "insensitive" } },
                { state: { contains: query, mode: "insensitive" } },
                { country: { contains: query, mode: "insensitive" } },
                { price: { contains: query, mode: "insensitive" } },
                {
                  Category: { name: { contains: query, mode: "insensitive" } },
                },
                {
                  amenities: {
                    some: { name: { contains: query, mode: "insensitive" } },
                  },
                },
                {
                  additionalPolicies: { contains: query, mode: "insensitive" },
                },
                { User: { name: { contains: query, mode: "insensitive" } } },
                { User: { email: { contains: query, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(shouldPaginate && { skip, take }),
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
        Lease: {
          where: {
            status: "ACTIVE",
          },
          select: {
            status: true,
          },
        },
      },
    }),
    prisma.listing.count({
      where: {
        status: { not: "Deleted" },
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { smallDescription: { contains: query, mode: "insensitive" } },
                { address: { contains: query, mode: "insensitive" } },
                { city: { contains: query, mode: "insensitive" } },
                { state: { contains: query, mode: "insensitive" } },
                { country: { contains: query, mode: "insensitive" } },
                { price: { contains: query, mode: "insensitive" } },
                {
                  Category: { name: { contains: query, mode: "insensitive" } },
                },
                {
                  amenities: {
                    some: { name: { contains: query, mode: "insensitive" } },
                  },
                },
              ],
            }
          : {}),
      },
    }),
  ]);

  return {
    listings,
    pagination: {
      total: totalCount,
      page: shouldPaginate ? page : 1,
      limit: shouldPaginate ? limit : totalCount,
      totalPages: shouldPaginate ? Math.ceil(totalCount / limit) : 1,
    },
  };
};

export type GetTotalListingsType = Awaited<
  ReturnType<typeof getTotalListings>
>["listings"][0];
