import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";

export const getBookingTimelines = async (id: string) => {
  const { user } = await requireUser();

  const timelines = await prisma.bookingTimeline.findMany({
    where: {
      bookingId: id,
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
      User: {
        select: {
          name: true,
          role: true,
        },
      },
    },
  });

  return timelines;
};
