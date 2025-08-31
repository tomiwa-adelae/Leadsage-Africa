import "server-only";
import { prisma } from "@/lib/db";
import { requireLandlord } from "../landlord/require-landlord";
import { requireUser } from "../user/require-user";

export const getListingUpcomingBookings = async (listingId: string) => {
  await requireUser();

  const bookings = await prisma.booking.findMany({
    where: {
      status: {
        in: ["Pending", "Confirmed"],
      },
      listingId,
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

export type GetListingUpcomingBookingsType = Awaited<
  ReturnType<typeof getListingUpcomingBookings>
>[0];
