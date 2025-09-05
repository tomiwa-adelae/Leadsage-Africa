import "server-only";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireLandlord } from "../require-landlord";

interface Params {
  query?: string;
  page?: number;
  limit?: number;
}

export const getApplications = async ({
  query,
  page = 1,
  limit,
}: Params = {}) => {
  const { user } = await requireLandlord();

  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [applications, totalCount] = await Promise.all([
    prisma.application.findMany({
      where: {
        Listing: {
          userId: user.id,
        },
        ...(query
          ? {
              OR: [
                { employmentStatus: { contains: query, mode: "insensitive" } },
                { employerName: { contains: query, mode: "insensitive" } },
                { employerEmail: { contains: query, mode: "insensitive" } },
                {
                  employerPhoneNumber: { contains: query, mode: "insensitive" },
                },
                { jobTitle: { contains: query, mode: "insensitive" } },
                { monthlyIncome: { contains: query, mode: "insensitive" } },
                {
                  currentLandlordName: { contains: query, mode: "insensitive" },
                },
                {
                  currentLandlordEmail: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  currentLandlordPhoneNumber: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                { reasonsForMoving: { contains: query, mode: "insensitive" } },
                { additionalInfo: { contains: query, mode: "insensitive" } },
                { rejectedReasons: { contains: query, mode: "insensitive" } },
                // Note: status is an enum, so we check if query matches any enum values
                ...([
                  "PENDING",
                  "UNDER_REVIEW",
                  "APPROVED",
                  "REJECTED",
                  "DELETED",
                ].some((status) =>
                  status.toLowerCase().includes(query.toLowerCase())
                )
                  ? [
                      {
                        status: {
                          in: [
                            "PENDING",
                            "UNDER_REVIEW",
                            "APPROVED",
                            "REJECTED",
                            "DELETED",
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
        currentLandlordPhoneNumber: true,
        currentLandlordEmail: true,
        currentLandlordName: true,
        employerEmail: true,
        employerName: true,
        employerPhoneNumber: true,
        employmentStatus: true,
        govermentID: true,
        jobTitle: true,
        monthlyIncome: true,
        proofOfEmployment: true,
        proofOfIncome: true,
        reasonsForMoving: true,
        additionalInfo: true,
        rejectedReasons: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        Listing: {
          select: {
            id: true,
            title: true,
            slug: true,
            listingId: true,
            address: true,
            city: true,
            state: true,
            country: true,
            price: true,
            photos: {
              select: {
                id: true,
                cover: true,
                src: true,
              },
            },
            Category: {
              select: {
                id: true,
                name: true,
              },
            },
            amenities: {
              select: {
                id: true,
                name: true,
              },
            },
            User: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredFirstName: true,
            phoneNumber: true,
          },
        },
      },
    }),
    prisma.application.count({
      where: {
        Listing: {
          userId: user.id,
        },
        ...(query
          ? {
              OR: [
                { employmentStatus: { contains: query, mode: "insensitive" } },
                { employerName: { contains: query, mode: "insensitive" } },
                { employerEmail: { contains: query, mode: "insensitive" } },
                {
                  employerPhoneNumber: { contains: query, mode: "insensitive" },
                },
                { jobTitle: { contains: query, mode: "insensitive" } },
                { monthlyIncome: { contains: query, mode: "insensitive" } },
                {
                  currentLandlordName: { contains: query, mode: "insensitive" },
                },
                {
                  currentLandlordEmail: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  currentLandlordPhoneNumber: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                { reasonsForMoving: { contains: query, mode: "insensitive" } },
                { additionalInfo: { contains: query, mode: "insensitive" } },
                { rejectedReasons: { contains: query, mode: "insensitive" } },
                // Note: status is an enum, so we check if query matches any enum values
                ...([
                  "PENDING",
                  "UNDER_REVIEW",
                  "APPROVED",
                  "REJECTED",
                  "DELETED",
                ].some((status) =>
                  status.toLowerCase().includes(query.toLowerCase())
                )
                  ? [
                      {
                        status: {
                          in: [
                            "PENDING",
                            "UNDER_REVIEW",
                            "APPROVED",
                            "REJECTED",
                            "DELETED",
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

  if (!applications || applications.length === 0) {
    return {
      applications: [],
      pagination: {
        total: 0,
        page: shouldPaginate ? page : 1,
        limit: shouldPaginate ? limit : 0,
        totalPages: 0,
      },
    };
  }

  return {
    applications,
    pagination: {
      total: totalCount,
      page: shouldPaginate ? page : 1,
      limit: shouldPaginate ? limit : totalCount,
      totalPages: shouldPaginate ? Math.ceil(totalCount / limit) : 1,
    },
  };
};

export type GetApplicationsType = Awaited<
  ReturnType<typeof getApplications>
>["applications"][0];
