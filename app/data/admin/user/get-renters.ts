import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";

export const getRenters = async ({ query, page = 1, limit }: Params = {}) => {
  await requireAdmin();
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [renters, totalCount] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: "renter",
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
                {
                  preferredFirstName: { contains: query, mode: "insensitive" },
                },
                { image: { contains: query, mode: "insensitive" } },
                { gender: { contains: query, mode: "insensitive" } },
                { phoneNumber: { contains: query, mode: "insensitive" } },
                { address: { contains: query, mode: "insensitive" } },
                { city: { contains: query, mode: "insensitive" } },
                { state: { contains: query, mode: "insensitive" } },
                { country: { contains: query, mode: "insensitive" } },
                { bio: { contains: query, mode: "insensitive" } },
                { role: { contains: query, mode: "insensitive" } },
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
        email: true,
        emailVerified: true,
        role: true,
        address: true,
        bio: true,
        country: true,
        state: true,
        city: true,
        gender: true,
        image: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
        preferredFirstName: true,
      },
    }),
    prisma.user.count({
      where: {
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
                {
                  preferredFirstName: { contains: query, mode: "insensitive" },
                },
                { image: { contains: query, mode: "insensitive" } },
                { gender: { contains: query, mode: "insensitive" } },
                { phoneNumber: { contains: query, mode: "insensitive" } },
                { address: { contains: query, mode: "insensitive" } },
                { city: { contains: query, mode: "insensitive" } },
                { state: { contains: query, mode: "insensitive" } },
                { country: { contains: query, mode: "insensitive" } },
                { bio: { contains: query, mode: "insensitive" } },
                { role: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
    }),
  ]);

  return {
    renters,
    pagination: {
      total: totalCount,
      page: shouldPaginate ? page : 1,
      limit: shouldPaginate ? limit : totalCount,
      totalPages: shouldPaginate ? Math.ceil(totalCount / limit) : 1,
    },
  };
};

export type GetRentersType = Awaited<
  ReturnType<typeof getRenters>
>["renters"][0];
