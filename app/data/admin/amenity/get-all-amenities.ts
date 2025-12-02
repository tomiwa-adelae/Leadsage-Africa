import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";

export const getTotalAmenities = async ({
  query,
  page = 1,
  limit,
}: Params) => {
  await requireAdmin();

  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [amenities, totalCount] = await Promise.all([
    prisma.amenities.findMany({
      where: {
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { icon: { contains: query, mode: "insensitive" } },
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
        name: true,
        icon: true,
        description: true,
        status: true,
        _count: {
          select: {
            listings: true,
          },
        },
      },
    }),
    prisma.amenities.count({
      where: {
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { icon: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
    }),
  ]);

  return {
    amenities,
    pagination: {
      total: totalCount,
      page: shouldPaginate ? page : 1,
      limit: shouldPaginate ? limit : totalCount,
      totalPages: shouldPaginate ? Math.ceil(totalCount / limit) : 1,
    },
  };
};

export type GetTotalAmenitiesType = Awaited<
  ReturnType<typeof getTotalAmenities>
>["amenities"][0];
