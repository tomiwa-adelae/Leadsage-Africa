import "server-only";
import { requireLandlord } from "../landlord/require-landlord";
import { prisma } from "@/lib/db";
import { requireUser } from "../user/require-user";

export const getCustomerBookings = async (limit: number = 10) => {
  const { user } = await requireUser();

  const bookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
    },
    take: limit,
    select: {
      id: true,
      status: true,
      date: true,
      createdAt: true,
      notes: true,
      timeSlot: true,
      listing: {
        select: {
          photos: true,
          title: true,
          address: true,
          User: {
            select: {
              name: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

export const getCustomerPendingBookings = async () => {
  const { user } = await requireUser();

  const bookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
      status: "Pending",
    },
    select: {
      id: true,
      date: true,
      timeSlot: true,
      status: true,
      listing: {
        select: {
          photos: true,
          title: true,
          address: true,
          User: {
            select: {
              name: true,
            },
          },
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return bookings;
};

export const getCustomerConfirmedBookings = async () => {
  const { user } = await requireUser();

  const bookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
      status: "Confirmed",
    },
  });

  return bookings;
};

export const getCustomerCancelledBookings = async () => {
  const { user } = await requireUser();

  const bookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
      status: "Cancelled",
    },
  });

  return bookings;
};

export const getCustomerCompletedBookings = async () => {
  const { user } = await requireUser();

  const bookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
      status: "Completed",
    },
  });

  return bookings;
};

export type GetCustomerBookingsType = Awaited<
  ReturnType<typeof getCustomerBookings>
>[0];
export type GetCustomerPendingBookingsType = Awaited<
  ReturnType<typeof getCustomerPendingBookings>
>[0];
export type GetCustomerConfirmedBookingsType = Awaited<
  ReturnType<typeof getCustomerConfirmedBookings>
>[0];
export type GetCustomerCancelledBookingsType = Awaited<
  ReturnType<typeof getCustomerCancelledBookings>
>[0];
export type GetCustomerCompletedBookingsType = Awaited<
  ReturnType<typeof getCustomerCompletedBookings>
>[0];
