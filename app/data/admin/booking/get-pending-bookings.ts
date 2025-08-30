import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";

export const getTotalPendingBookings = async () => {
  await requireAdmin();

  const bookings = await prisma.booking.findMany({
    where: {
      status: "Pending",
    },
    select: {
      id: true,
      date: true,
      timeSlot: true,
      status: true,
      listing: {
        select: {
          title: true,
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

export type GetTotalPendingBookingsType = Awaited<
  ReturnType<typeof getTotalPendingBookings>
>[0];
