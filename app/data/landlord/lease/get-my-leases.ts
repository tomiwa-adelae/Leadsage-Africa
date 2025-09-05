import "server-only";
import { prisma } from "@/lib/db";
import { requireLandlord } from "../require-landlord";

interface Params {
  query?: string;
  page?: number;
  limit?: number;
}

export const getMyLeases = async ({ query, page = 1, limit }: Params = {}) => {
  const { user } = await requireLandlord();

  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [leases, totalCount] = await Promise.all([
    prisma.lease.findMany({
      where: {
        Listing: {
          userId: user.id,
        },
        ...(query
          ? {
              OR: [
                { leaseId: { contains: query, mode: "insensitive" } },
                { startDate: { contains: query, mode: "insensitive" } },
                { endDate: { contains: query, mode: "insensitive" } },
                { moveInDate: { contains: query, mode: "insensitive" } },
                // Note: status and depositStatus are enums, so we check if query matches any enum values
                ...([
                  "PENDING",
                  "ACTIVE",
                  "EXPIRED",
                  "RENEWED",
                  "CANCELLED",
                  "TERMINATED",
                ].some((status) =>
                  status.toLowerCase().includes(query.toLowerCase())
                )
                  ? [
                      {
                        status: {
                          in: [
                            "PENDING",
                            "ACTIVE",
                            "EXPIRED",
                            "RENEWED",
                            "CANCELLED",
                            "TERMINATED",
                          ].filter((status) =>
                            status.toLowerCase().includes(query.toLowerCase())
                          ) as any,
                        },
                      },
                    ]
                  : []),
                ...(["PENDING", "PAID", "REFUNDED"].some((depositStatus) =>
                  depositStatus.toLowerCase().includes(query.toLowerCase())
                )
                  ? [
                      {
                        depositStatus: {
                          in: ["PENDING", "PAID", "REFUNDED"].filter(
                            (depositStatus) =>
                              depositStatus
                                .toLowerCase()
                                .includes(query.toLowerCase())
                          ) as any,
                        },
                      },
                    ]
                  : []),
                {
                  User: {
                    OR: [
                      { name: { contains: query, mode: "insensitive" } },
                      { email: { contains: query, mode: "insensitive" } },
                      {
                        preferredFirstName: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                      { phoneNumber: { contains: query, mode: "insensitive" } },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
                {
                  Listing: {
                    OR: [
                      { title: { contains: query, mode: "insensitive" } },
                      { listingId: { contains: query, mode: "insensitive" } },
                      { slug: { contains: query, mode: "insensitive" } },
                      {
                        smallDescription: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
                      { price: { contains: query, mode: "insensitive" } },
                      {
                        securityDeposit: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                      {
                        paymentFrequency: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                      {
                        Category: {
                          name: { contains: query, mode: "insensitive" },
                        },
                      },
                      {
                        amenities: {
                          some: {
                            name: { contains: query, mode: "insensitive" },
                          },
                        },
                      },
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
        leaseId: true,
        createdAt: true,
        updatedAt: true,
        endDate: true,
        startDate: true,
        depositStatus: true,
        landlordSignature: true,
        tenantSignature: true,
        moveInDate: true,
        status: true,
        Listing: {
          select: {
            id: true,
            title: true,
            slug: true,
            listingId: true,
            smallDescription: true,
            bedrooms: true,
            bathrooms: true,
            propertySize: true,
            state: true,
            address: true,
            city: true,
            country: true,
            price: true,
            securityDeposit: true,
            paymentFrequency: true,
            availabilityDate: true,
            petPolicy: true,
            smokingPolicy: true,
            partyPolicy: true,
            additionalPolicies: true,
            Category: {
              select: {
                id: true,
                name: true,
              },
            },
            amenities: {
              select: {
                id: true,
                description: true,
                icon: true,
                name: true,
              },
            },
            photos: {
              select: {
                id: true,
                src: true,
                cover: true,
              },
            },
            User: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
                phoneNumber: true,
                gender: true,
                address: true,
                city: true,
                state: true,
                country: true,
                createdAt: true,
                emailVerified: true,
              },
            },
          },
        },
        User: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            phoneNumber: true,
            gender: true,
            address: true,
            city: true,
            state: true,
            country: true,
            role: true,
            preferredFirstName: true,
            mailingAddress: true,
            mailingCity: true,
            mailingState: true,
            mailingCountry: true,
            emergencyEmail: true,
            emergencyName: true,
            emergencyLanguage: true,
            emergencyPhoneNumber: true,
            emergencyRelationship: true,
            updatedAt: true,
            createdAt: true,
            emailVerified: true,
          },
        },
      },
    }),
    prisma.lease.count({
      where: {
        Listing: {
          userId: user.id,
        },
        ...(query
          ? {
              OR: [
                { leaseId: { contains: query, mode: "insensitive" } },
                { startDate: { contains: query, mode: "insensitive" } },
                { endDate: { contains: query, mode: "insensitive" } },
                { moveInDate: { contains: query, mode: "insensitive" } },
                // Note: status and depositStatus are enums, so we check if query matches any enum values
                ...([
                  "PENDING",
                  "ACTIVE",
                  "EXPIRED",
                  "RENEWED",
                  "CANCELLED",
                  "TERMINATED",
                ].some((status) =>
                  status.toLowerCase().includes(query.toLowerCase())
                )
                  ? [
                      {
                        status: {
                          in: [
                            "PENDING",
                            "ACTIVE",
                            "EXPIRED",
                            "RENEWED",
                            "CANCELLED",
                            "TERMINATED",
                          ].filter((status) =>
                            status.toLowerCase().includes(query.toLowerCase())
                          ) as any,
                        },
                      },
                    ]
                  : []),
                ...(["PENDING", "PAID", "REFUNDED"].some((depositStatus) =>
                  depositStatus.toLowerCase().includes(query.toLowerCase())
                )
                  ? [
                      {
                        depositStatus: {
                          in: ["PENDING", "PAID", "REFUNDED"].filter(
                            (depositStatus) =>
                              depositStatus
                                .toLowerCase()
                                .includes(query.toLowerCase())
                          ) as any,
                        },
                      },
                    ]
                  : []),
                {
                  User: {
                    OR: [
                      { name: { contains: query, mode: "insensitive" } },
                      { email: { contains: query, mode: "insensitive" } },
                      {
                        preferredFirstName: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                      { phoneNumber: { contains: query, mode: "insensitive" } },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
                {
                  Listing: {
                    OR: [
                      { title: { contains: query, mode: "insensitive" } },
                      { listingId: { contains: query, mode: "insensitive" } },
                      { slug: { contains: query, mode: "insensitive" } },
                      {
                        smallDescription: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
                      { price: { contains: query, mode: "insensitive" } },
                      {
                        securityDeposit: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                      {
                        paymentFrequency: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                      {
                        Category: {
                          name: { contains: query, mode: "insensitive" },
                        },
                      },
                      {
                        amenities: {
                          some: {
                            name: { contains: query, mode: "insensitive" },
                          },
                        },
                      },
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
    leases,
    pagination: {
      total: totalCount,
      page: shouldPaginate ? page : 1,
      limit: shouldPaginate ? limit : totalCount,
      totalPages: shouldPaginate ? Math.ceil(totalCount / limit) : 1,
    },
  };
};

export type GetMyLeasesType = Awaited<
  ReturnType<typeof getMyLeases>
>["leases"][0];
