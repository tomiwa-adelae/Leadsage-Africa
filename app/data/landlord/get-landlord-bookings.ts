import "server-only";
import { requireLandlord } from "./require-landlord";
import { prisma } from "@/lib/db";

export const getLandlordBookings = async (limit: number = 10) => {
  const { user } = await requireLandlord();

  const bookings = await prisma.booking.findMany({
    where: {
      listing: {
        userId: user.id,
      },
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

export const getLandlordPendingBookings = async () => {
  const { user } = await requireLandlord();

  const bookings = await prisma.booking.findMany({
    where: {
      listing: {
        userId: user.id,
      },
      status: "Pending",
    },
  });

  return bookings;
};

export const getLandlordConfirmedBookings = async () => {
  const { user } = await requireLandlord();

  const bookings = await prisma.booking.findMany({
    where: {
      listing: {
        userId: user.id,
      },
      status: "Confirmed",
    },
  });

  return bookings;
};

export const getLandlordCancelledBookings = async () => {
  const { user } = await requireLandlord();

  const bookings = await prisma.booking.findMany({
    where: {
      listing: {
        userId: user.id,
      },
      status: "Cancelled",
    },
  });

  return bookings;
};

export const getLandlordCompletedBookings = async () => {
  const { user } = await requireLandlord();

  const bookings = await prisma.booking.findMany({
    where: {
      listing: {
        userId: user.id,
      },
      status: "Completed",
    },
  });

  return bookings;
};

export type GetLandlordBookingsType = Awaited<
  ReturnType<typeof getLandlordBookings>
>[0];

export type GetLandlordPendingBookingsType = Awaited<
  ReturnType<typeof getLandlordPendingBookings>
>[0];

export type GetLandlordConfirmedBookingsType = Awaited<
  ReturnType<typeof getLandlordConfirmedBookings>
>[0];

export type GetLandlordCancelledBookingsType = Awaited<
  ReturnType<typeof getLandlordCancelledBookings>
>[0];

export type GetLandlordCompletedBookingsType = Awaited<
  ReturnType<typeof getLandlordCompletedBookings>
>[0];
