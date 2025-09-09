"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { cancelTourAdmin } from "@/lib/emails/cancel-a-tour-admin";
import { cancelTourLandlord } from "@/lib/emails/cancel-tour-landlord";
import { cancelTourTenant } from "@/lib/emails/cancel-tour-tenant";
import { env } from "@/lib/env";
import { ApiResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  uninterestedModalFormSchema,
  UninterestedModalFormSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

import Mailjet from "node-mailjet";
const mailjet = Mailjet.apiConnect(
  env.MAILJET_API_PUBLIC_KEY,
  env.MAILJET_API_PRIVATE_KEY
);

export const cancelBooking = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    const booking = await prisma.booking.findUnique({
      where: {
        id,
        userId: user.id,
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
            address: true,
            city: true,
            state: true,
            country: true,
            User: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!booking)
      return { status: "error", message: "Oops! An error occurred!" };

    await prisma.booking.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        status: "Cancelled",
        cancelledBy: user.role,
      },
    });

    await prisma.bookingTimeline.create({
      data: {
        bookingId: booking.id,
        status: "Cancelled",
        userId: user.id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Tour",
        color: "bg-red-600",
        title: `Tour appointment cancelled`,
        message: `You’ve successfully cancelled your tour for ${
          booking.listing.title
        } on ${formatDate(booking.date)} at ${booking.timeSlot}.`,
      },
    });

    await prisma.notification.create({
      data: {
        userId: booking.listing.User.id,
        type: "Warning",
        color: "bg-yellow-500",
        title: `Tour cancelled`,
        message: `${booking.user.name} cancelled their tour appointment for ${
          booking.listing.title
        } on ${formatDate(booking.date)} at ${booking.timeSlot}.`,
      },
    });

    const location = `${booking.listing?.address!}, ${booking.listing
      ?.city!}, ${booking.listing?.state!}, ${booking.listing?.country!}`;

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Africa",
          },
          To: [
            {
              Email: user.email,
              Name: user.name,
            },
          ],
          ReplyTo: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Support",
          },
          Subject: `Leadsage Africa – Tour Canceled`,
          TextPart: `Leadsage Africa – Tour Canceled`,
          HTMLPart: cancelTourTenant({
            name: user.name,
            date: formatDate(booking.date),
            location,
            time: booking.timeSlot,
          }),
        },
      ],
    });

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Africa",
          },
          To: [
            {
              Email: booking.listing.User.email,
              Name: booking.listing.User.name,
            },
          ],
          ReplyTo: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Support",
          },
          Subject: `Leadsage Africa – Tour Canceled`,
          TextPart: `Leadsage Africa – Tour Canceled`,
          HTMLPart: cancelTourLandlord({
            landlordName: booking.listing.User.name,
            tenantName: user.name,
            date: formatDate(booking.date),
            location,
            time: booking.timeSlot,
          }),
        },
      ],
    });

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Africa",
          },
          To: [
            {
              Email: env.ADMIN_EMAIL_ADDRESS,
              Name: "Leadsage Africa Admin",
            },
          ],
          ReplyTo: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Support",
          },
          Subject: `Leadsage Africa – Tour Canceled`,
          TextPart: `Leadsage Africa – Tour Canceled`,
          HTMLPart: cancelTourAdmin({
            landlordName: booking.listing.User.name,
            tenantName: user.name,
            date: formatDate(booking.date),
            location,
            time: booking.timeSlot,
            id: booking.id,
          }),
        },
      ],
    });

    revalidatePath("/notifications");
    revalidatePath("/bookings");

    return { status: "success", message: "Booking successfully cancelled" };
  } catch (error) {
    return { status: "error", message: "Failed to cancel booking" };
  }
};

export const applyForListing = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const booking = await prisma.booking.findUnique({
      where: {
        id,
        status: "Completed",
      },
      select: {
        user: {
          select: {
            name: true,
          },
        },
        listing: {
          select: {
            title: true,
            User: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!booking)
      return { status: "error", message: "Oops! An error occurred!" };

    await prisma.bookingFeedback.create({
      data: {
        bookingId: id,
        status: "INTERESTED",
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Success",
        color: "bg-green-600",
        title: `Interest Recorded`,
        message: `We’ve saved your interest in ${booking.listing.title}.`,
      },
    });

    await prisma.notification.create({
      data: {
        userId: booking.listing.User.id,
        type: "Success",
        color: "bg-green-600",
        title: `Tour cancelled`,
        message: `${booking.user.name} has shown interest in your property ${booking.listing.title}. Check your dashboard for details.`,
      },
    });

    revalidatePath("/bookings");

    return {
      status: "success",
      message: "Listing successfully applied for. Redirecting...",
    };
  } catch (error) {
    return { status: "error", message: "Failed to apply for listing" };
  }
};

export const uninterestedBooking = async (
  id: string,
  data: UninterestedModalFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const validation = uninterestedModalFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "You need to leave a feedback" };

    const booking = await prisma.booking.findUnique({
      where: {
        id,
        status: "Completed",
      },
      select: {
        user: {
          select: {
            name: true,
          },
        },
        listing: {
          select: {
            title: true,
            User: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!booking)
      return { status: "error", message: "Oops! An error occurred!" };

    await prisma.bookingFeedback.create({
      data: {
        bookingId: id,
        status: "NOT_INTERESTED",
        reasons: validation.data.reasons,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Warning",
        color: "bg-yellow-500",
        title: `Decline Recorded`,
        message: `You’ve marked ${booking.listing.title} as Not Interested. Thanks for your feedback`,
      },
    });

    await prisma.notification.create({
      data: {
        userId: booking.listing.User.id,
        type: "Warning",
        color: "bg-yellow-500",
        title: `Listing declined`,
        message: `${booking.user.name} has declined your property ${booking.listing.title}. Reasons: ${validation.data.reasons}`,
      },
    });

    revalidatePath("/bookings");

    return {
      status: "success",
      message: "Successfully saved feedback. Browse other listings",
    };
  } catch (error) {
    return { status: "error", message: "Failed to proceed with feedback" };
  }
};

export const notSureBooking = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const booking = await prisma.booking.findUnique({
      where: {
        id,
        status: "Completed",
      },
      select: {
        user: {
          select: {
            name: true,
          },
        },
        listing: {
          select: {
            title: true,
            id: true,
            User: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!booking)
      return { status: "error", message: "Oops! An error occurred!" };

    await prisma.bookingFeedback.create({
      data: {
        bookingId: id,
        status: "NOT_SURE",
      },
    });

    const listing = await prisma.listing.findUnique({
      where: {
        id: booking.listing.id,
      },
    });

    if (!listing)
      return { status: "error", message: "Oops! An error occurred" };

    await prisma.savedListing.create({
      data: {
        userId: user.id,
        listingId: booking.listing.id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Warning",
        color: "bg-yellow-500",
        title: `Feedback Recorded`,
        message: `We’ve saved ${booking.listing.title} to your Saved Properties. You can revisit it anytime.`,
      },
    });

    await prisma.notification.create({
      data: {
        userId: booking.listing.User.id,
        type: "Warning",
        color: "bg-yellow-500",
        title: `Booking consideration`,
        message: `${booking.user.name} is still considering ${booking.listing.title}`,
      },
    });

    revalidatePath("/bookings");

    return {
      status: "success",
      message: "Successfully saved properties. Browse other listings",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to add listing to your saved properties",
    };
  }
};
