import "server-only";
import { requireLandlord } from "../landlord/require-landlord";
import { prisma } from "@/lib/db";

export const getLandlordBookings = async (limit: number = 10) => {
  const { user } = await requireLandlord();

  const bookings = await prisma.touring.findMany({
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
      createdAt: "asc",
    },
  });

  return bookings;
};

export const getLandlordPendingBookings = async () => {
  const { user } = await requireLandlord();

  const bookings = await prisma.touring.findMany({
    where: {
      listing: {
        userId: user.id,
      },
      status: "Pending",
    },
  });

  return bookings;
};

export type GetLandlordBookingsType = Awaited<
  ReturnType<typeof getLandlordBookings>
>;

export type GetLandlordPendingBookingsType = Awaited<
  ReturnType<typeof getLandlordPendingBookings>
>;
