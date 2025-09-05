import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";

interface Params {
  query?: string;
  page?: number;
  limit?: number;
}

export const getTotalCancelledBookings = async ({
  query,
  page = 1,
  limit,
}: Params = {}) => {
  await requireAdmin();

  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [bookings, totalCount] = await Promise.all([
    prisma.booking.findMany({
      where: {
        status: "Cancelled",
        ...(query
          ? {
              OR: [
                { bookingId: { contains: query, mode: "insensitive" } },
                { timeSlot: { contains: query, mode: "insensitive" } },
                { notes: { contains: query, mode: "insensitive" } },
                {
                  user: {
                    OR: [
                      { name: { contains: query, mode: "insensitive" } },
                      { email: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
                {
                  listing: {
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
        date: true,
        timeSlot: true,
        status: true,
        bookingId: true,
        notes: true,
        createdAt: true,
        listing: {
          select: {
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
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.booking.count({
      where: {
        status: "Cancelled",
        ...(query
          ? {
              OR: [
                { bookingId: { contains: query, mode: "insensitive" } },
                { timeSlot: { contains: query, mode: "insensitive" } },
                { notes: { contains: query, mode: "insensitive" } },
                {
                  user: {
                    OR: [
                      { name: { contains: query, mode: "insensitive" } },
                      { email: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
                {
                  listing: {
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
    bookings,
    pagination: {
      total: totalCount,
      page: shouldPaginate ? page : 1,
      limit: shouldPaginate ? limit : totalCount,
      totalPages: shouldPaginate ? Math.ceil(totalCount / limit) : 1,
    },
  };
};

export type GetTotalCancelledBookingsType = Awaited<
  ReturnType<typeof getTotalCancelledBookings>
>["bookings"][0];
