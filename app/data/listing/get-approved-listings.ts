import "server-only";
import { prisma } from "@/lib/db";

interface Params {
  query?: string;
  page?: number;
  limit?: number;
  userId?: string; // Optional for saved listings when user is logged in
}

export const getApprovedListings = async ({
  query,
  page = 1,
  limit,
  userId,
}: Params = {}) => {
  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [listings, totalCount] = await Promise.all([
    prisma.listing.findMany({
      where: {
        isApproved: true,
        status: "Published", // Only show published listings to public
        Lease: {
          none: {
            status: "ACTIVE",
          },
        },
        ...(query
          ? {
              OR: [
                { listingId: { contains: query, mode: "insensitive" } },
                { title: { contains: query, mode: "insensitive" } },
                { slug: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { smallDescription: { contains: query, mode: "insensitive" } },
                { address: { contains: query, mode: "insensitive" } },
                { city: { contains: query, mode: "insensitive" } },
                { state: { contains: query, mode: "insensitive" } },
                { country: { contains: query, mode: "insensitive" } },
                { price: { contains: query, mode: "insensitive" } },
                { paymentFrequency: { contains: query, mode: "insensitive" } },
                { propertySize: { contains: query, mode: "insensitive" } },
                { petPolicy: { contains: query, mode: "insensitive" } },
                { smokingPolicy: { contains: query, mode: "insensitive" } },
                { partyPolicy: { contains: query, mode: "insensitive" } },
                {
                  additionalPolicies: { contains: query, mode: "insensitive" },
                },
                {
                  Category: { name: { contains: query, mode: "insensitive" } },
                },
                {
                  amenities: {
                    some: { name: { contains: query, mode: "insensitive" } },
                  },
                },
                {
                  User: {
                    OR: [
                      { name: { contains: query, mode: "insensitive" } },
                      { email: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
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
        title: true,
        slug: true,
        listingId: true,
        description: true,
        smallDescription: true,
        price: true,
        discount: true,
        securityDeposit: true,
        paymentFrequency: true,
        address: true,
        state: true,
        city: true,
        country: true,
        postalCode: true,
        bedrooms: true,
        bathrooms: true,
        propertySize: true,
        availabilityDate: true,
        petPolicy: true,
        smokingPolicy: true,
        partyPolicy: true,
        additionalPolicies: true,
        status: true,
        isApproved: true,
        createdAt: true,
        Category: {
          select: {
            name: true,
            id: true,
            description: true,
            icon: true,
          },
        },
        amenities: {
          select: {
            id: true,
            name: true,
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
        User: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            phoneNumber: true,
          },
        },
        savedListing: userId
          ? {
              where: {
                userId,
              },
              select: {
                id: true,
              },
            }
          : false, // Don't include saved listings if no user
        Lease: {
          where: {
            status: "ACTIVE",
          },
          select: {
            id: true,
            status: true,
          },
        },
        booking: {
          where: {
            status: "Pending",
          },
          select: {
            id: true,
            status: true,
          },
        },
        application: {
          where: {
            status: "PENDING",
          },
          select: {
            id: true,
            status: true,
          },
        },
      },
    }),
    prisma.listing.count({
      where: {
        isApproved: true,
        status: "Published", // Only show published listings to public
        Lease: {
          none: {
            status: "ACTIVE",
          },
        },
        ...(query
          ? {
              OR: [
                { listingId: { contains: query, mode: "insensitive" } },
                { title: { contains: query, mode: "insensitive" } },
                { slug: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { smallDescription: { contains: query, mode: "insensitive" } },
                { address: { contains: query, mode: "insensitive" } },
                { city: { contains: query, mode: "insensitive" } },
                { state: { contains: query, mode: "insensitive" } },
                { country: { contains: query, mode: "insensitive" } },
                { price: { contains: query, mode: "insensitive" } },
                { paymentFrequency: { contains: query, mode: "insensitive" } },
                { propertySize: { contains: query, mode: "insensitive" } },
                { petPolicy: { contains: query, mode: "insensitive" } },
                { smokingPolicy: { contains: query, mode: "insensitive" } },
                { partyPolicy: { contains: query, mode: "insensitive" } },
                {
                  additionalPolicies: { contains: query, mode: "insensitive" },
                },
                {
                  Category: { name: { contains: query, mode: "insensitive" } },
                },
                {
                  amenities: {
                    some: { name: { contains: query, mode: "insensitive" } },
                  },
                },
                {
                  User: {
                    OR: [
                      { name: { contains: query, mode: "insensitive" } },
                      { email: { contains: query, mode: "insensitive" } },
                    ],
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

export type GetApprovedListingsType = Awaited<
  ReturnType<typeof getApprovedListings>
>["listings"][0];
