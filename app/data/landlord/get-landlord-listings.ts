import "server-only";
import { requireLandlord } from "./require-landlord";
import { prisma } from "@/lib/db";

interface Params {
  query?: string;
  page?: number;
  limit?: number;
}

export const getLandlordListings = async ({
  query,
  page = 1,
  limit,
}: Params = {}) => {
  const { user } = await requireLandlord();

  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [listings, totalCount] = await Promise.all([
    prisma.listing.findMany({
      where: {
        userId: user.id,
        status: {
          notIn: ["Archived", "Deleted"],
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
                { availabilityDate: { contains: query, mode: "insensitive" } },
                { petPolicy: { contains: query, mode: "insensitive" } },
                { smokingPolicy: { contains: query, mode: "insensitive" } },
                { partyPolicy: { contains: query, mode: "insensitive" } },
                {
                  additionalPolicies: { contains: query, mode: "insensitive" },
                },
                // Note: status is an enum, so we check if query matches any enum values (excluding Archived and Deleted)
                ...(["Draft", "Published", "Restored", "Rejected"].some(
                  (status) => status.toLowerCase().includes(query.toLowerCase())
                )
                  ? [
                      {
                        status: {
                          in: [
                            "Draft",
                            "Published",
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
        propertySize: true,
        bedrooms: true,
        bathrooms: true,
        availabilityDate: true,
        price: true,
        paymentFrequency: true,
        securityDeposit: true,
        discount: true,
        address: true,
        state: true,
        city: true,
        country: true,
        postalCode: true,
        petPolicy: true,
        smokingPolicy: true,
        partyPolicy: true,
        additionalPolicies: true,
        status: true,
        isApproved: true,
        rejectedReasons: true,
        createdAt: true,
        updatedAt: true,
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
            icon: true,
            id: true,
            name: true,
            description: true,
          },
        },
        photos: {
          select: {
            id: true,
            cover: true,
            src: true,
          },
        },
        Lease: {
          where: {
            status: "ACTIVE",
          },
          select: {
            id: true,
            leaseId: true,
            status: true,
            startDate: true,
            endDate: true,
            depositStatus: true,
          },
        },
        savedListing: {
          select: {
            id: true,
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
        userId: user.id,
        status: {
          notIn: ["Archived", "Deleted"],
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
                { availabilityDate: { contains: query, mode: "insensitive" } },
                { petPolicy: { contains: query, mode: "insensitive" } },
                { smokingPolicy: { contains: query, mode: "insensitive" } },
                { partyPolicy: { contains: query, mode: "insensitive" } },
                {
                  additionalPolicies: { contains: query, mode: "insensitive" },
                },
                // Note: status is an enum, so we check if query matches any enum values (excluding Archived and Deleted)
                ...(["Draft", "Published", "Restored", "Rejected"].some(
                  (status) => status.toLowerCase().includes(query.toLowerCase())
                )
                  ? [
                      {
                        status: {
                          in: [
                            "Draft",
                            "Published",
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

export type GetLandlordListingsType = Awaited<
  ReturnType<typeof getLandlordListings>
>["listings"][0];
