import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";

interface Params {
  query?: string;
  page?: number;
  limit?: number;
}

export const getPendingReviewApplications = async ({
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
        status: "UNDER_REVIEW",
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
                      { slug: { contains: query, mode: "insensitive" } },
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
        createdAt: true,
        updatedAt: true,
        status: true,
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
            slug: true,
            listingId: true,
            address: true,
            city: true,
            state: true,
            country: true,
            photos: {
              select: {
                id: true,
                cover: true,
                src: true,
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
        status: "UNDER_REVIEW",
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
                      { slug: { contains: query, mode: "insensitive" } },
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

export type GetPendingReviewApplicationsType = Awaited<
  ReturnType<typeof getPendingReviewApplications>
>["applications"][0];
