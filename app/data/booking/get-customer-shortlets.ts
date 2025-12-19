import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { ShortletBookingStatus } from "@/lib/generated/prisma";

interface Params {
  query?: string;
  page?: number;
  limit?: number;
}

export const getCustomerShortlets = async ({
  query,
  page = 1,
  limit,
}: Params = {}) => {
  const { user } = await requireUser();

  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  // Define the common filter
  const whereClause: any = {
    userId: user.id,
    ...(query
      ? {
          OR: [
            { shortletID: { contains: query, mode: "insensitive" } },
            { rejectionReason: { contains: query, mode: "insensitive" } },
            {
              status: {
                in: Object.values(ShortletBookingStatus).filter((s) =>
                  s.toLowerCase().includes(query.toLowerCase())
                ),
              },
            },
            {
              Listing: {
                // Note: Capitalized 'Listing' matches your schema relation name
                OR: [
                  { title: { contains: query, mode: "insensitive" } },
                  { address: { contains: query, mode: "insensitive" } },
                  { city: { contains: query, mode: "insensitive" } },
                ],
              },
            },
          ],
        }
      : {}),
  };

  const [shortlets, totalCount] = await Promise.all([
    prisma.shortletBooking.findMany({
      // Fixed: changed from prisma.booking
      where: whereClause,
      ...(shouldPaginate && { skip, take }),
      select: {
        id: true,
        shortletID: true,
        status: true,
        checkInDate: true,
        checkOutDate: true,
        totalPrice: true,
        createdAt: true,
        instructions: true,
        wifiName: true,
        wifiPassword: true,
        additionalDirections: true,
        Listing: {
          // Fixed: Relation name is 'Listing' in your schema
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            state: true,
            country: true,
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
              },
            },
            photos: {
              select: { src: true, cover: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.shortletBooking.count({ where: whereClause }),
  ]);

  return {
    shortlets,
    pagination: {
      total: totalCount,
      page: shouldPaginate ? page : 1,
      limit: shouldPaginate ? limit : totalCount,
      totalPages: shouldPaginate ? Math.ceil(totalCount / limit) : 1,
    },
  };
};

export type GetCustomerShortletsType = Awaited<
  ReturnType<typeof getCustomerShortlets>
>["shortlets"][0];
