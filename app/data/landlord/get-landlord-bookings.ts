import "server-only";
import { requireLandlord } from "./require-landlord";
import { prisma } from "@/lib/db";

interface Params {
  query?: string;
  page?: number;
  limit?: number;
}

export const getLandlordBookings = async ({
  query,
  page = 1,
  limit,
}: Params = {}) => {
  const { user } = await requireLandlord();

  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [bookings, totalCount] = await Promise.all([
    prisma.booking.findMany({
      where: {
        listing: {
          userId: user.id,
        },
        ...(query
          ? {
              OR: [
                { bookingId: { contains: query, mode: "insensitive" } },
                { timeSlot: { contains: query, mode: "insensitive" } },
                { notes: { contains: query, mode: "insensitive" } },
                // Note: status is an enum, so we check if query matches any enum value
                ...(["Pending", "Confirmed", "Cancelled", "Completed"].some(
                  (status) => status.toLowerCase().includes(query.toLowerCase())
                )
                  ? [
                      {
                        status: {
                          in: [
                            "Pending",
                            "Confirmed",
                            "Cancelled",
                            "Completed",
                          ].filter((status) =>
                            status.toLowerCase().includes(query.toLowerCase())
                          ) as any,
                        },
                      },
                    ]
                  : []),
                {
                  user: {
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
                  listing: {
                    OR: [
                      { title: { contains: query, mode: "insensitive" } },
                      { listingId: { contains: query, mode: "insensitive" } },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
              ],
            }
          : {}),
      },
      ...(shouldPaginate && { skip, take }),
      select: {
        id: true,
        status: true,
        date: true,
        createdAt: true,
        updatedAt: true,
        notes: true,
        timeSlot: true,
        bookingId: true,
        listing: {
          select: {
            id: true,
            photos: {
              select: {
                id: true,
                src: true,
                cover: true,
              },
            },
            title: true,
            listingId: true,
            address: true,
            city: true,
            state: true,
            country: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredFirstName: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.booking.count({
      where: {
        listing: {
          userId: user.id,
        },
        ...(query
          ? {
              OR: [
                { bookingId: { contains: query, mode: "insensitive" } },
                { timeSlot: { contains: query, mode: "insensitive" } },
                { notes: { contains: query, mode: "insensitive" } },
                // Note: status is an enum, so we check if query matches any enum value
                ...(["Pending", "Confirmed", "Cancelled", "Completed"].some(
                  (status) => status.toLowerCase().includes(query.toLowerCase())
                )
                  ? [
                      {
                        status: {
                          in: [
                            "Pending",
                            "Confirmed",
                            "Cancelled",
                            "Completed",
                          ].filter((status) =>
                            status.toLowerCase().includes(query.toLowerCase())
                          ) as any,
                        },
                      },
                    ]
                  : []),
                {
                  user: {
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
                  listing: {
                    OR: [
                      { title: { contains: query, mode: "insensitive" } },
                      { listingId: { contains: query, mode: "insensitive" } },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
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

export const getLandlordPendingBookings = async ({
  query,
  page = 1,
  limit,
}: Params = {}) => {
  const { user } = await requireLandlord();

  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [bookings, totalCount] = await Promise.all([
    prisma.booking.findMany({
      where: {
        listing: {
          userId: user.id,
        },
        status: "Pending",
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
                  listing: {
                    OR: [
                      { title: { contains: query, mode: "insensitive" } },
                      { listingId: { contains: query, mode: "insensitive" } },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
              ],
            }
          : {}),
      },
      ...(shouldPaginate && { skip, take }),
      select: {
        id: true,
        status: true,
        date: true,
        createdAt: true,
        updatedAt: true,
        notes: true,
        timeSlot: true,
        bookingId: true,
        listing: {
          select: {
            id: true,
            photos: {
              select: {
                id: true,
                src: true,
                cover: true,
              },
            },
            title: true,
            listingId: true,
            address: true,
            city: true,
            state: true,
            country: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredFirstName: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.booking.count({
      where: {
        listing: {
          userId: user.id,
        },
        status: "Pending",
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
                  listing: {
                    OR: [
                      { title: { contains: query, mode: "insensitive" } },
                      { listingId: { contains: query, mode: "insensitive" } },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
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

export const getLandlordConfirmedBookings = async ({
  query,
  page = 1,
  limit,
}: Params = {}) => {
  const { user } = await requireLandlord();

  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [bookings, totalCount] = await Promise.all([
    prisma.booking.findMany({
      where: {
        listing: {
          userId: user.id,
        },
        status: "Confirmed",
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
                  listing: {
                    OR: [
                      { title: { contains: query, mode: "insensitive" } },
                      { listingId: { contains: query, mode: "insensitive" } },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
              ],
            }
          : {}),
      },
      ...(shouldPaginate && { skip, take }),
      select: {
        id: true,
        status: true,
        date: true,
        createdAt: true,
        updatedAt: true,
        notes: true,
        timeSlot: true,
        bookingId: true,
        listing: {
          select: {
            id: true,
            photos: {
              select: {
                id: true,
                src: true,
                cover: true,
              },
            },
            title: true,
            listingId: true,
            address: true,
            city: true,
            state: true,
            country: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredFirstName: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.booking.count({
      where: {
        listing: {
          userId: user.id,
        },
        status: "Confirmed",
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
                  listing: {
                    OR: [
                      { title: { contains: query, mode: "insensitive" } },
                      { listingId: { contains: query, mode: "insensitive" } },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
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

export const getLandlordCancelledBookings = async ({
  query,
  page = 1,
  limit,
}: Params = {}) => {
  const { user } = await requireLandlord();

  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [bookings, totalCount] = await Promise.all([
    prisma.booking.findMany({
      where: {
        listing: {
          userId: user.id,
        },
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
                  listing: {
                    OR: [
                      { title: { contains: query, mode: "insensitive" } },
                      { listingId: { contains: query, mode: "insensitive" } },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
              ],
            }
          : {}),
      },
      ...(shouldPaginate && { skip, take }),
      select: {
        id: true,
        status: true,
        date: true,
        createdAt: true,
        updatedAt: true,
        notes: true,
        timeSlot: true,
        bookingId: true,
        listing: {
          select: {
            id: true,
            photos: {
              select: {
                id: true,
                src: true,
                cover: true,
              },
            },
            title: true,
            listingId: true,
            address: true,
            city: true,
            state: true,
            country: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredFirstName: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.booking.count({
      where: {
        listing: {
          userId: user.id,
        },
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
                  listing: {
                    OR: [
                      { title: { contains: query, mode: "insensitive" } },
                      { listingId: { contains: query, mode: "insensitive" } },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
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

export const getLandlordCompletedBookings = async ({
  query,
  page = 1,
  limit,
}: Params = {}) => {
  const { user } = await requireLandlord();

  // Only apply pagination if limit is provided and greater than 0
  const shouldPaginate = limit && limit > 0;
  const skip = shouldPaginate ? (page - 1) * limit : undefined;
  const take = shouldPaginate ? limit : undefined;

  const [bookings, totalCount] = await Promise.all([
    prisma.booking.findMany({
      where: {
        listing: {
          userId: user.id,
        },
        status: "Completed",
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
                  listing: {
                    OR: [
                      { title: { contains: query, mode: "insensitive" } },
                      { listingId: { contains: query, mode: "insensitive" } },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
              ],
            }
          : {}),
      },
      ...(shouldPaginate && { skip, take }),
      select: {
        id: true,
        status: true,
        date: true,
        createdAt: true,
        updatedAt: true,
        notes: true,
        timeSlot: true,
        bookingId: true,
        listing: {
          select: {
            id: true,
            photos: {
              select: {
                id: true,
                src: true,
                cover: true,
              },
            },
            title: true,
            listingId: true,
            address: true,
            city: true,
            state: true,
            country: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredFirstName: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.booking.count({
      where: {
        listing: {
          userId: user.id,
        },
        status: "Completed",
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
                  listing: {
                    OR: [
                      { title: { contains: query, mode: "insensitive" } },
                      { listingId: { contains: query, mode: "insensitive" } },
                      { address: { contains: query, mode: "insensitive" } },
                      { city: { contains: query, mode: "insensitive" } },
                      { state: { contains: query, mode: "insensitive" } },
                      { country: { contains: query, mode: "insensitive" } },
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

export type GetLandlordBookingsType = Awaited<
  ReturnType<typeof getLandlordBookings>
>["bookings"][0];

export type GetLandlordPendingBookingsType = Awaited<
  ReturnType<typeof getLandlordPendingBookings>
>["bookings"][0];

export type GetLandlordConfirmedBookingsType = Awaited<
  ReturnType<typeof getLandlordConfirmedBookings>
>["bookings"][0];

export type GetLandlordCancelledBookingsType = Awaited<
  ReturnType<typeof getLandlordCancelledBookings>
>["bookings"][0];

export type GetLandlordCompletedBookingsType = Awaited<
  ReturnType<typeof getLandlordCompletedBookings>
>["bookings"][0];
