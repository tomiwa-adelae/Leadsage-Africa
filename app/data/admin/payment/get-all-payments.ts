import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "../require-admin";

export const getAllPayments = async ({
  query,
  page = 1,
  limit,
}: Params = {}) => {
  await requireAdmin();

  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [payments, totalCount] = await Promise.all([
    prisma.payment.findMany({
      where: {
        ...(query
          ? {
              OR: [
                { amount: { contains: query, mode: "insensitive" } },
                { reference: { contains: query, mode: "insensitive" } },
                { method: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { trxref: { contains: query, mode: "insensitive" } },
                { transaction: { contains: query, mode: "insensitive" } },
                // Note: type and status are enums, so we check if query matches any enum values
                ...(["RENT", "SECURITY_DEPOSIT", "SERVICE_FEE", "OTHER"].some(
                  (type) => type.toLowerCase().includes(query.toLowerCase())
                )
                  ? [
                      {
                        type: {
                          in: [
                            "RENT",
                            "SECURITY_DEPOSIT",
                            "SERVICE_FEE",
                            "OTHER",
                          ].filter((type) =>
                            type.toLowerCase().includes(query.toLowerCase())
                          ) as any,
                        },
                      },
                    ]
                  : []),
                ...([
                  "PENDING",
                  "SUCCESS",
                  "FAILED",
                  "REFUNDED",
                  "CANCELLED",
                ].some((status) =>
                  status.toLowerCase().includes(query.toLowerCase())
                )
                  ? [
                      {
                        status: {
                          in: [
                            "PENDING",
                            "SUCCESS",
                            "FAILED",
                            "REFUNDED",
                            "CANCELLED",
                          ].filter((status) =>
                            status.toLowerCase().includes(query.toLowerCase())
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
                    ],
                  },
                },
                {
                  Lease: {
                    OR: [
                      { leaseId: { contains: query, mode: "insensitive" } },
                      { startDate: { contains: query, mode: "insensitive" } },
                      { endDate: { contains: query, mode: "insensitive" } },
                      {
                        Listing: {
                          OR: [
                            { title: { contains: query, mode: "insensitive" } },
                            {
                              listingId: {
                                contains: query,
                                mode: "insensitive",
                              },
                            },
                            { slug: { contains: query, mode: "insensitive" } },
                            {
                              address: { contains: query, mode: "insensitive" },
                            },
                            { city: { contains: query, mode: "insensitive" } },
                            { state: { contains: query, mode: "insensitive" } },
                            {
                              country: { contains: query, mode: "insensitive" },
                            },
                            { price: { contains: query, mode: "insensitive" } },
                            {
                              Category: {
                                name: { contains: query, mode: "insensitive" },
                              },
                            },
                            {
                              amenities: {
                                some: {
                                  name: {
                                    contains: query,
                                    mode: "insensitive",
                                  },
                                },
                              },
                            },
                            {
                              User: {
                                OR: [
                                  {
                                    name: {
                                      contains: query,
                                      mode: "insensitive",
                                    },
                                  },
                                  {
                                    email: {
                                      contains: query,
                                      mode: "insensitive",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
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
        amount: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        status: true,
        paidAt: true,
        method: true,
        reference: true,
        description: true,
        trxref: true,
        transaction: true,
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredFirstName: true,
            phoneNumber: true,
          },
        },
        Lease: {
          select: {
            id: true,
            leaseId: true,
            startDate: true,
            endDate: true,
            status: true,
            depositStatus: true,
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
          },
        },
      },
    }),
    prisma.payment.count({
      where: {
        ...(query
          ? {
              OR: [
                { amount: { contains: query, mode: "insensitive" } },
                { reference: { contains: query, mode: "insensitive" } },
                { method: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { trxref: { contains: query, mode: "insensitive" } },
                { transaction: { contains: query, mode: "insensitive" } },
                // Note: type and status are enums, so we check if query matches any enum values
                ...(["RENT", "SECURITY_DEPOSIT", "SERVICE_FEE", "OTHER"].some(
                  (type) => type.toLowerCase().includes(query.toLowerCase())
                )
                  ? [
                      {
                        type: {
                          in: [
                            "RENT",
                            "SECURITY_DEPOSIT",
                            "SERVICE_FEE",
                            "OTHER",
                          ].filter((type) =>
                            type.toLowerCase().includes(query.toLowerCase())
                          ) as any,
                        },
                      },
                    ]
                  : []),
                ...([
                  "PENDING",
                  "SUCCESS",
                  "FAILED",
                  "REFUNDED",
                  "CANCELLED",
                ].some((status) =>
                  status.toLowerCase().includes(query.toLowerCase())
                )
                  ? [
                      {
                        status: {
                          in: [
                            "PENDING",
                            "SUCCESS",
                            "FAILED",
                            "REFUNDED",
                            "CANCELLED",
                          ].filter((status) =>
                            status.toLowerCase().includes(query.toLowerCase())
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
                    ],
                  },
                },
                {
                  Lease: {
                    OR: [
                      { leaseId: { contains: query, mode: "insensitive" } },
                      { startDate: { contains: query, mode: "insensitive" } },
                      { endDate: { contains: query, mode: "insensitive" } },
                      {
                        Listing: {
                          OR: [
                            { title: { contains: query, mode: "insensitive" } },
                            {
                              listingId: {
                                contains: query,
                                mode: "insensitive",
                              },
                            },
                            { slug: { contains: query, mode: "insensitive" } },
                            {
                              address: { contains: query, mode: "insensitive" },
                            },
                            { city: { contains: query, mode: "insensitive" } },
                            { state: { contains: query, mode: "insensitive" } },
                            {
                              country: { contains: query, mode: "insensitive" },
                            },
                            { price: { contains: query, mode: "insensitive" } },
                            {
                              Category: {
                                name: { contains: query, mode: "insensitive" },
                              },
                            },
                            {
                              amenities: {
                                some: {
                                  name: {
                                    contains: query,
                                    mode: "insensitive",
                                  },
                                },
                              },
                            },
                            {
                              User: {
                                OR: [
                                  {
                                    name: {
                                      contains: query,
                                      mode: "insensitive",
                                    },
                                  },
                                  {
                                    email: {
                                      contains: query,
                                      mode: "insensitive",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
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
    payments,
    pagination: {
      total: totalCount,
      page: shouldPaginate ? page : 1,
      limit: shouldPaginate ? limit : totalCount,
      totalPages: shouldPaginate ? Math.ceil(totalCount / limit) : 1,
    },
  };
};

export type GetAllPaymentsType = Awaited<
  ReturnType<typeof getAllPayments>
>["payments"][0];
