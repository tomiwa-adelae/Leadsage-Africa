"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  rejectListingFormSchema,
  RejectListingFormSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

export const approveListing = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const listing = await prisma.listing.findUnique({
      where: {
        id,
      },
      select: {
        title: true,
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!listing)
      return { status: "error", message: "Oops! An error occurred!" };

    await prisma.listing.update({
      where: {
        id,
        status: "Published",
      },
      data: {
        isApproved: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: listing.User.id,
        type: "Success",
        color: "bg-green-600",
        title: `Listing approved`,
        message: `Congratulations! Your listing "${listing.title}" has been approved and is now visible to renters.`,
      },
    });

    revalidatePath("/notifications");

    revalidatePath("/landlord/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/landlord/listings");
    revalidatePath("/admin/listings");

    return { status: "success", message: "Listing successfully approved" };
  } catch (error) {
    return { status: "error", message: "Failed to approve lisitng" };
  }
};

export const unapproveListing = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const listing = await prisma.listing.findUnique({
      where: {
        id,
      },
      select: {
        title: true,
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!listing)
      return { status: "error", message: "Oops! An error occurred!" };

    await prisma.listing.update({
      where: {
        id,
        status: "Published",
        isApproved: true,
      },
      data: {
        isApproved: false,
      },
    });

    await prisma.notification.create({
      data: {
        userId: listing.User.id,
        type: "Warning",
        color: "bg-red-500",
        title: `Listing is down`,
        message: `Your listing "${listing.title}" has been unapproved. Please review the feedback and update your listing.`,
      },
    });

    revalidatePath("/landlord/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/landlord/listings");
    revalidatePath("/admin/listings");
    revalidatePath("/notifications");

    return { status: "success", message: "Listing successfully unapproved" };
  } catch (error) {
    return { status: "error", message: "Failed to unapprove lisitng" };
  }
};

export const rejectListing = async (
  id: string,
  data: RejectListingFormSchemaType
): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const validation = rejectListingFormSchema.safeParse(data);

    const listing = await prisma.listing.findUnique({
      where: {
        id,
      },
      select: {
        title: true,
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!listing)
      return { status: "error", message: "Oops! An error occurred!" };

    await prisma.listing.update({
      where: {
        id,
        status: "Published",
      },
      data: {
        isApproved: false,
        status: "Rejected",
        rejectedReasons: validation.data?.reasons,
      },
    });

    await prisma.notification.create({
      data: {
        userId: listing.User.id,
        type: "Warning",
        color: "bg-yellow-500",
        title: `Listing requires changes`,
        message: `Your listing "${listing.title}" couldn’t be approved. Please review the feedback and update your listing.`,
      },
    });

    revalidatePath("/landlord/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/landlord/listings");
    revalidatePath("/admin/listings");
    revalidatePath("/notifications");

    return { status: "success", message: "Listing successfully rejected" };
  } catch (error) {
    return { status: "error", message: "Failed to reject lisitng" };
  }
};

export const deleteListing = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const listing = await prisma.listing.findUnique({
      where: {
        id,
      },
      select: {
        title: true,
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!listing)
      return { status: "error", message: "Oops! An error occurred!" };

    await prisma.listing.update({
      where: {
        id,
      },
      data: {
        status: "Deleted",
        isApproved: false,
      },
    });

    await prisma.notification.create({
      data: {
        userId: listing.User.id,
        type: "Delete",
        color: "bg-red-600",
        title: `Listing deleted`,
        message: `Your listing "${listing.title}" has been deleted by admin. Please review the feedback and update your listing.`,
      },
    });

    revalidatePath("/landlord/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/landlord/listings");
    revalidatePath("/admin/listings");
    revalidatePath("/notifications");

    return { status: "success", message: "Listing successfully deleted" };
  } catch (error) {
    return { status: "error", message: "Failed to delete lisitng" };
  }
};

export const restoreListing = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const listing = await prisma.listing.findUnique({
      where: {
        id,
        status: "Deleted",
      },
      select: {
        title: true,
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!listing)
      return { status: "error", message: "Oops! An error occurred!" };

    await prisma.listing.update({
      where: {
        id,
        status: "Deleted",
      },
      data: {
        status: "Restored",
        isApproved: false,
      },
    });

    await prisma.notification.create({
      data: {
        userId: listing.User.id,
        type: "Listing",
        color: "bg-green-600",
        title: `Listing restored`,
        message: `Your listing "${listing.title}" has been restored by admin.`,
      },
    });

    revalidatePath("/landlord/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/landlord/listings");
    revalidatePath("/admin/listings");
    revalidatePath("/notifications");

    return { status: "success", message: "Listing successfully restored" };
  } catch (error) {
    return { status: "error", message: "Failed to restore lisitng" };
  }
};

export const unarchiveListing = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const listing = await prisma.listing.findUnique({
      where: {
        id,
        status: "Archived",
      },
      select: {
        title: true,
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!listing)
      return { status: "error", message: "Oops! An error occurred!" };

    await prisma.listing.update({
      where: {
        id,
        status: "Archived",
      },
      data: {
        status: "Published",
      },
    });

    await prisma.notification.create({
      data: {
        userId: listing.User.id,
        type: "Listing",
        color: "bg-green-600",
        title: `Listing unarchived`,
        message: `Your listing "${listing.title}" has been unarchived by admin.`,
      },
    });

    revalidatePath("/landlord/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/landlord/listings");
    revalidatePath("/admin/listings");
    revalidatePath("/notifications");

    return { status: "success", message: "Listing successfully unarchived" };
  } catch (error) {
    return { status: "error", message: "Failed to unarchive lisitng" };
  }
};

export const confirmBooking = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    const booking = await prisma.booking.findUnique({
      where: {
        id,
        status: "Pending",
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

    await prisma.booking.update({
      where: {
        id,
        status: "Pending",
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
        userId: booking.listing.User.id,
        type: "Tour",
        color: "bg-blue-600",
        title: `Tour appointment confirmed`,
        message: `Leadsage admin confirmed the tour request for ${
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
        color: "bg-blue-600",
        title: `Tour confirmed`,
        message: `Your tour request for ${
          booking.listing.title
        } has been confirmed by the admin. See you on ${formatDate(
          booking.date
        )} at ${booking.timeSlot}.`,
      },
    });

    revalidatePath("/notifications");
    revalidatePath("/admin/bookings");
    revalidatePath("/bookings");

    return { status: "success", message: "Booking successfully confirmed" };
  } catch (error) {
    return { status: "error", message: "Failed to confirm booking" };
  }
};

export const completedBooking = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    const booking = await prisma.booking.findUnique({
      where: {
        id,
        status: "Confirmed",
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

    await prisma.booking.update({
      where: {
        id,
        status: "Confirmed",
      },
      data: {
        status: "Completed",
        confirmedBy: user.role,
      },
    });

    await prisma.bookingTimeline.create({
      data: {
        bookingId: booking.id,
        status: "Completed",
        userId: user.id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: booking.listing.User.id,
        type: "Tour",
        color: "bg-green-600",
        title: `Tour appointment completed`,
        message: `${booking.user.name} has completed the tour request for ${
          booking.listing.title
        } on ${formatDate(booking.date)} at ${booking.timeSlot}.`,
      },
    });

    await prisma.notification.create({
      data: {
        userId: booking.user.id,
        type: "Tour",
        color: "bg-green-600",
        title: `Tour completed`,
        message: `Your tour request for ${booking.listing.title} has been completed.`,
      },
    });

    revalidatePath("/notifications");
    revalidatePath("/admin/bookings");
    revalidatePath("/bookings");

    return { status: "success", message: "Booking successfully completed" };
  } catch (error) {
    return { status: "error", message: "Failed to complete booking" };
  }
};

export const cancelBooking = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    const booking = await prisma.booking.findUnique({
      where: {
        id,
        status: {
          not: "Completed",
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

    await prisma.booking.update({
      where: {
        id,
        status: {
          not: "Completed",
        },
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
        userId: booking.user.id,
        type: "Tour",
        color: "bg-red-600",
        title: `Tour appointment cancelled`,
        message: `Your tour request has been cancelled for ${
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
        message: `${booking.user.name} tour request for ${
          booking.listing.title
        } on ${formatDate(booking.date)} at ${
          booking.timeSlot
        } has been cancelled.`,
      },
    });

    revalidatePath("/notifications");
    revalidatePath("/bookings");
    revalidatePath("/admin/bookings");

    return { status: "success", message: "Booking successfully cancelled" };
  } catch (error) {
    return { status: "error", message: "Failed to cancel booking" };
  }
};
