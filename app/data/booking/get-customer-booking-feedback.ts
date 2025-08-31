import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";

export const getCustomerBookingFeedback = async (id: string) => {
  const { user } = await requireUser();

  const feedback = await prisma.bookingFeedback.findFirst({
    where: {
      bookingId: id,
      Booking: {
        userId: user.id,
      },
    },
    select: {
      status: true,
      reasons: true,
      id: true,
    },
  });

  return feedback;
};

export type GetCustomerBookingType = Awaited<
  ReturnType<typeof getCustomerBookingFeedback>
>;
