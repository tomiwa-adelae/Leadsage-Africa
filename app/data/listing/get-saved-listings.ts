import "server-only";
import { prisma } from "@/lib/db";
import { requireUser } from "../user/require-user";

interface Params {
  query?: string;
  page?: number;
  limit?: number;
}

export const getSavedListings = async ({
  query,
  page = 1,
  limit,
}: Params = {}) => {
  const { user } = await requireUser();

  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [savedListings, totalCount] = await Promise.all([
    prisma.savedListing.findMany({
      where: {
        userId: user.id,
        ...(query
          ? {
              Listing: {
                OR: [
                  { listingId: { contains: query, mode: "insensitive" } },
                  { title: { contains: query, mode: "insensitive" } },
                  { slug: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } },
                  {
                    smallDescription: { contains: query, mode: "insensitive" },
                  },
                  { address: { contains: query, mode: "insensitive" } },
                  { city: { contains: query, mode: "insensitive" } },
                  { state: { contains: query, mode: "insensitive" } },
                  { country: { contains: query, mode: "insensitive" } },
                  { price: { contains: query, mode: "insensitive" } },
                  {
                    paymentFrequency: { contains: query, mode: "insensitive" },
                  },
                  { propertySize: { contains: query, mode: "insensitive" } },
                  { petPolicy: { contains: query, mode: "insensitive" } },
                  { smokingPolicy: { contains: query, mode: "insensitive" } },
                  { partyPolicy: { contains: query, mode: "insensitive" } },
                  {
                    additionalPolicies: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                  // Note: status is an enum, so we check if query matches any enum values
                  ...([
                    "Draft",
                    "Published",
                    "Deleted",
                    "Archived",
                    "Restored",
                    "Rejected",
                  ].some((status) =>
                    status.toLowerCase().includes(query.toLowerCase())
                  )
                    ? [
                        {
                          status: {
                            in: [
                              "Draft",
                              "Published",
                              "Deleted",
                              "Archived",
                              "Restored",
                              "Rejected",
                            ].filter((status) =>
                              status.toLowerCase().includes(query.toLowerCase())
                            ) as any,
                          },
                        },
                      ]
                    : []),
                  {
                    Category: {
                      name: { contains: query, mode: "insensitive" },
                    },
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
              },
            }
          : {}),
      },
      ...(shouldPaginate && { skip, take }),
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        Listing: {
          select: {
            id: true,
            title: true,
            price: true,
            slug: true,
            listingId: true,
            description: true,
            smallDescription: true,
            address: true,
            city: true,
            state: true,
            country: true,
            postalCode: true,
            bedrooms: true,
            bathrooms: true,
            propertySize: true,
            paymentFrequency: true,
            securityDeposit: true,
            availabilityDate: true,
            petPolicy: true,
            smokingPolicy: true,
            partyPolicy: true,
            additionalPolicies: true,
            status: true,
            isApproved: true,
            createdAt: true,
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
            amenities: {
              select: {
                id: true,
                name: true,
                description: true,
                icon: true,
              },
            },
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                phoneNumber: true,
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
            Lease: {
              where: {
                status: "ACTIVE",
              },
              select: {
                id: true,
                status: true,
              },
            },
          },
        },
      },
    }),
    prisma.savedListing.count({
      where: {
        userId: user.id,
        ...(query
          ? {
              Listing: {
                OR: [
                  { listingId: { contains: query, mode: "insensitive" } },
                  { title: { contains: query, mode: "insensitive" } },
                  { slug: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } },
                  {
                    smallDescription: { contains: query, mode: "insensitive" },
                  },
                  { address: { contains: query, mode: "insensitive" } },
                  { city: { contains: query, mode: "insensitive" } },
                  { state: { contains: query, mode: "insensitive" } },
                  { country: { contains: query, mode: "insensitive" } },
                  { price: { contains: query, mode: "insensitive" } },
                  {
                    paymentFrequency: { contains: query, mode: "insensitive" },
                  },
                  { propertySize: { contains: query, mode: "insensitive" } },
                  { petPolicy: { contains: query, mode: "insensitive" } },
                  { smokingPolicy: { contains: query, mode: "insensitive" } },
                  { partyPolicy: { contains: query, mode: "insensitive" } },
                  {
                    additionalPolicies: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                  // Note: status is an enum, so we check if query matches any enum values
                  ...([
                    "Draft",
                    "Published",
                    "Deleted",
                    "Archived",
                    "Restored",
                    "Rejected",
                  ].some((status) =>
                    status.toLowerCase().includes(query.toLowerCase())
                  )
                    ? [
                        {
                          status: {
                            in: [
                              "Draft",
                              "Published",
                              "Deleted",
                              "Archived",
                              "Restored",
                              "Rejected",
                            ].filter((status) =>
                              status.toLowerCase().includes(query.toLowerCase())
                            ) as any,
                          },
                        },
                      ]
                    : []),
                  {
                    Category: {
                      name: { contains: query, mode: "insensitive" },
                    },
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
              },
            }
          : {}),
      },
    }),
  ]);

  return {
    savedListings,
    pagination: {
      total: totalCount,
      page: shouldPaginate ? page : 1,
      limit: shouldPaginate ? limit : totalCount,
      totalPages: shouldPaginate ? Math.ceil(totalCount / limit) : 1,
    },
  };
};

export type GetSavedListingsType = Awaited<
  ReturnType<typeof getSavedListings>
>["savedListings"][0];
