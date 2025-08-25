import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";

export const getExistingBooking = async (listingId: string) => {
  const { user } = await requireUser();

  const booking = await prisma.touring.findFirst({
    where: {
      listingId,
      userId: user.id,
      status: {
        in: ["Pending", "Confirmed"],
      },
    },
    select: {
      id: true,
      date: true,
      timeSlot: true,
      status: true,
    },
  });

  return booking;
};
