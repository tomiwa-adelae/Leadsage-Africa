import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";

interface Params {
  query?: string;
  page?: number;
  limit?: number;
}

export const getTotalApplications = async ({
  query,
  page = 1,
  limit,
}: Params = {}) => {
  await requireAdmin();

  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [applications, totalCount] = await Promise.all([
    prisma.application.findMany({
      where: {
        ...(query
          ? {
              OR: [
                { employmentStatus: { contains: query, mode: "insensitive" } },
                { employerName: { contains: query, mode: "insensitive" } },
                { employerEmail: { contains: query, mode: "insensitive" } },
                { jobTitle: { contains: query, mode: "insensitive" } },
                { monthlyIncome: { contains: query, mode: "insensitive" } },
                {
                  currentLandlordName: { contains: query, mode: "insensitive" },
                },
                { reasonsForMoving: { contains: query, mode: "insensitive" } },
                { additionalInfo: { contains: query, mode: "insensitive" } },
                { rejectedReasons: { contains: query, mode: "insensitive" } },
                // Note: status is an enum, so we check if query matches any enum value
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
                    ],
                  },
                },
                {
                  Listing: {
                    OR: [
                      { title: { contains: query, mode: "insensitive" } },
                      { listingId: { contains: query, mode: "insensitive" } },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
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
        status: true,
        employmentStatus: true,
        employerName: true,
        jobTitle: true,
        monthlyIncome: true,
        currentLandlordName: true,
        reasonsForMoving: true,
        rejectedReasons: true,
        createdAt: true,
        updatedAt: true,
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        Listing: {
          select: {
            id: true,
            title: true,
            listingId: true,
            address: true,
            city: true,
            state: true,
            country: true,
            photos: {
              select: {
                id: true,
                src: true,
                cover: true,
              },
            },
            User: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    }),
    prisma.application.count({
      where: {
        ...(query
          ? {
              OR: [
                { employmentStatus: { contains: query, mode: "insensitive" } },
                { employerName: { contains: query, mode: "insensitive" } },
                { employerEmail: { contains: query, mode: "insensitive" } },
                { jobTitle: { contains: query, mode: "insensitive" } },
                { monthlyIncome: { contains: query, mode: "insensitive" } },
                {
                  currentLandlordName: { contains: query, mode: "insensitive" },
                },
                { reasonsForMoving: { contains: query, mode: "insensitive" } },
                { additionalInfo: { contains: query, mode: "insensitive" } },
                { rejectedReasons: { contains: query, mode: "insensitive" } },
                // Note: status is an enum, so we check if query matches any enum value
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
                    ],
                  },
                },
                {
                  Listing: {
                    OR: [
                      { title: { contains: query, mode: "insensitive" } },
                      { listingId: { contains: query, mode: "insensitive" } },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
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
                },
              ],
            }
          : {}),
      },
    }),
  ]);

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

export type GetTotalApplicationsType = Awaited<
  ReturnType<typeof getTotalApplications>
>["applications"][0];
