import "server-only";
import { prisma } from "@/lib/db";
import { requireLandlord } from "../landlord/require-landlord";
import { requireUser } from "../user/require-user";

export const getListingPastBookings = async (listingId: string) => {
  await requireUser();

  const bookings = await prisma.booking.findMany({
    where: {
      status: {
        in: ["Cancelled", "Completed"],
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

export type GetListingPastBookingsType = Awaited<
  ReturnType<typeof getListingPastBookings>
>[0];
