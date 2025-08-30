"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const confirmBooking = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    const booking = await prisma.booking.findUnique({
      where: {
        id,
        listing: {
          userId: user.id,
        },
      },
      select: {
        id: true,
        timeSlot: true,
        date: true,
        user: {
          select: {
            name: true,
            id: true,
          },
        },
        listing: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!booking)
      return { status: "error", message: "Oops! An error occurred!" };

    await prisma.booking.update({
      where: {
        id,
        listing: {
          userId: user.id,
        },
      },
      data: {
        status: "Confirmed",
        confirmedBy: user.role,
      },
    });

    await prisma.bookingTimeline.create({
      data: {
        bookingId: booking.id,
        status: "Confirmed",
        userId: user.id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Tour",
        color: "bg-green-600",
        title: `Tour appointment confirmed`,
        message: `You’ve confirmed the tour request for ${
          booking.user.name
        } at ${booking.listing.title} on ${formatDate(booking.date)} at ${
          booking.timeSlot
        }.`,
      },
    });

    await prisma.notification.create({
      data: {
        userId: booking.user.id,
        type: "Tour",
        color: "bg-green-600",
        title: `Tour confirmed`,
        message: `Your tour request for ${
          booking.listing.title
        } has been confirmed by the landlord. See you on ${formatDate(
          booking.date
        )} at ${booking.timeSlot}.`,
      },
    });

    revalidatePath("/notifications");
    revalidatePath("/bookings");

    return { status: "success", message: "Booking successfully confirmed" };
  } catch (error) {
    return { status: "error", message: "Failed to confirm booking" };
  }
};
