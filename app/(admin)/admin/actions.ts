"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  rejectApplicationFormSchema,
  RejectApplicationFormSchemaType,
  rejectListingFormSchema,
  RejectListingFormSchemaType,
  requestMoreInfoApplicationFormSchema,
  RequestMoreInfoApplicationFormSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";
import { VALID_LOADERS } from "next/dist/shared/lib/image-config";

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
        description: true,
        smallDescription: true,
        address: true,
        city: true,
        state: true,
        country: true,
        bedrooms: true,
        bathrooms: true,
        availabilityDate: true,
        petPolicy: true,
        smokingPolicy: true,
        partyPolicy: true,
        price: true,
        paymentFrequency: true,
        securityDeposit: true,
        listingId: true,
        photos: true,
        amenities: true,
        categoryId: true,
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!listing)
      return { status: "error", message: "Oops! An error occurred!" };

    if (!listing.title)
      return { status: "error", message: "Listing title is required" };
    if (!listing.description)
      return { status: "error", message: "Listing description is required" };
    if (!listing.smallDescription)
      return {
        status: "error",
        message: "Listing small description is required",
      };
    if (!listing.address)
      return { status: "error", message: "Listing address is required" };
    if (!listing.city)
      return { status: "error", message: "Listing city is required" };
    if (!listing.state)
      return { status: "error", message: "Listing state is required" };
    if (!listing.country)
      return { status: "error", message: "Listing country is required" };
    if (!listing.bedrooms)
      return { status: "error", message: "Listing bedrooms is required" };
    if (!listing.bathrooms)
      return { status: "error", message: "Listing bathrooms is required" };
    if (!listing.availabilityDate)
      return {
        status: "error",
        message: "Listing availability date is required",
      };
    if (!listing.petPolicy)
      return { status: "error", message: "Listing pet policy is required" };
    if (!listing.smokingPolicy)
      return { status: "error", message: "Listing smoking policy is required" };
    if (!listing.partyPolicy)
      return { status: "error", message: "Listing party policy is required" };
    if (!listing.price)
      return { status: "error", message: "Listing price is required" };
    if (!listing.paymentFrequency)
      return {
        status: "error",
        message: "Listing payment frequency is required",
      };
    if (!listing.securityDeposit)
      return {
        status: "error",
        message: "Listing security deposit is required",
      };
    if (!listing.listingId)
      return { status: "error", message: "Listing listingId is required" };
    if (!listing.categoryId)
      return { status: "error", message: "Listing category is required" };
    if (listing.photos.length < 5)
      return { status: "error", message: "You must upload at least 5 photos" };
    if (listing.amenities.length < 1)
      return {
        status: "error",
        message: "You must select at least 1 amenities",
      };

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
        Lease: {
          where: {
            status: "ACTIVE",
          },
        },
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!listing)
      return { status: "error", message: "Oops! An error occurred!" };

    if (listing?.Lease[0].status === "ACTIVE")
      return {
        status: "error",
        message:
          "Oops! You cannot delete this listing as it is currently occupied",
      };

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

export const publishListing = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const listing = await prisma.listing.findUnique({
      where: {
        id,
      },
      select: {
        title: true,
        description: true,
        smallDescription: true,
        address: true,
        city: true,
        state: true,
        country: true,
        bedrooms: true,
        bathrooms: true,
        availabilityDate: true,
        petPolicy: true,
        smokingPolicy: true,
        partyPolicy: true,
        price: true,
        paymentFrequency: true,
        securityDeposit: true,
        listingId: true,
        photos: true,
        amenities: true,
        categoryId: true,
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!listing)
      return { status: "error", message: "Oops! An error occurred!" };

    if (!listing.title)
      return { status: "error", message: "Listing title is required" };
    if (!listing.description)
      return { status: "error", message: "Listing description is required" };
    if (!listing.smallDescription)
      return {
        status: "error",
        message: "Listing small description is required",
      };
    if (!listing.address)
      return { status: "error", message: "Listing address is required" };
    if (!listing.city)
      return { status: "error", message: "Listing city is required" };
    if (!listing.state)
      return { status: "error", message: "Listing state is required" };
    if (!listing.country)
      return { status: "error", message: "Listing country is required" };
    if (!listing.bedrooms)
      return { status: "error", message: "Listing bedrooms is required" };
    if (!listing.bathrooms)
      return { status: "error", message: "Listing bathrooms is required" };
    if (!listing.availabilityDate)
      return {
        status: "error",
        message: "Listing availability date is required",
      };
    if (!listing.petPolicy)
      return { status: "error", message: "Listing pet policy is required" };
    if (!listing.smokingPolicy)
      return { status: "error", message: "Listing smoking policy is required" };
    if (!listing.partyPolicy)
      return { status: "error", message: "Listing party policy is required" };
    if (!listing.price)
      return { status: "error", message: "Listing price is required" };
    if (!listing.paymentFrequency)
      return {
        status: "error",
        message: "Listing payment frequency is required",
      };
    if (!listing.securityDeposit)
      return {
        status: "error",
        message: "Listing security deposit is required",
      };
    if (!listing.listingId)
      return { status: "error", message: "Listing listingId is required" };
    if (!listing.categoryId)
      return { status: "error", message: "Listing category is required" };
    if (listing.photos.length < 5)
      return { status: "error", message: "You must upload at least 5 photos" };
    if (listing.amenities.length < 1)
      return {
        status: "error",
        message: "You must select at least 1 amenities",
      };

    await prisma.listing.update({
      where: {
        id,
        status: {
          not: "Published",
        },
      },
      data: {
        status: "Published",
      },
    });

    await prisma.notification.create({
      data: {
        userId: listing.User.id,
        type: "Success",
        color: "bg-green-600",
        title: `Listing published`,
        message: `Congratulations! Your listing "${listing.title}" has been published and is now visible to renters.`,
      },
    });

    revalidatePath("/notifications");
    revalidatePath("/landlord/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/landlord/listings");
    revalidatePath("/admin/listings");

    return { status: "success", message: "Listing successfully published" };
  } catch (error) {
    return { status: "error", message: "Failed to publish lisitng" };
  }
};

export const approveApplication = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    const application = await prisma.application.findUnique({
      where: {
        id,
      },
      select: {
        status: true,
      },
    });

    if (!application)
      return { status: "error", message: "Oops! An error occurred" };

    if (application.status === "PENDING")
      return {
        status: "error",
        message: "You can not approve an incomplete application",
      };

    await prisma.application.update({
      where: {
        id,
      },
      data: {
        status: "APPROVED",
      },
    });

    revalidatePath("/admin");

    return { status: "success", message: "Application successfully approved" };
  } catch (error) {
    return { status: "error", message: "Failed to approve application" };
  }
};

export const rejectApplication = async (
  id: string,
  data: RejectApplicationFormSchemaType
): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    const validation = rejectApplicationFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    const application = await prisma.application.findUnique({
      where: {
        id,
      },
      select: {
        status: true,
      },
    });

    if (!application)
      return { status: "error", message: "Oops! An error occurred" };

    if (application.status === "PENDING")
      return {
        status: "error",
        message: "You can not reject an incomplete application",
      };

    await prisma.application.update({
      where: {
        id,
      },
      data: {
        status: "REJECTED",
        rejectedReasons: validation.data.reasons,
      },
    });

    revalidatePath("/admin");

    return { status: "success", message: "Application successfully rejected" };
  } catch (error) {
    return { status: "error", message: "Failed to reject application" };
  }
};

export const requestMoreInformationApplication = async (
  id: string,
  data: RequestMoreInfoApplicationFormSchemaType
): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    const validation = requestMoreInfoApplicationFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    const application = await prisma.application.findUnique({
      where: {
        id,
      },
      select: {
        status: true,
      },
    });

    if (!application)
      return { status: "error", message: "Oops! An error occurred" };

    if (application.status === "PENDING")
      return {
        status: "error",
        message:
          "You can not request additional information for an incomplete application",
      };

    await prisma.application.update({
      where: {
        id,
      },
      data: {
        status: "UNDER_REVIEW",
        additionalInfo: validation.data.additionalInformation,
      },
    });

    revalidatePath("/admin");

    return { status: "success", message: "Request successfully sent" };
  } catch (error) {
    return { status: "error", message: "Failed to send request" };
  }
};

export const deleteApplication = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const application = await prisma.application.findUnique({
      where: {
        id,
      },
    });

    if (!application)
      return { status: "error", message: "Oops! An error occurred!" };

    await prisma.application.update({
      where: {
        id,
      },
      data: {
        status: "DELETED",
      },
    });

    revalidatePath("/landlord");
    revalidatePath("/admin");
    revalidatePath("/notifications");

    return { status: "success", message: "Application successfully deleted" };
  } catch (error) {
    return { status: "error", message: "Failed to delete application" };
  }
};

export const terminateLease = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    await prisma.lease.update({
      where: {
        id,
      },
      data: {
        status: "TERMINATED",
      },
    });

    revalidatePath("/admin");

    return { status: "success", message: "Lease successfully terminated" };
  } catch (error) {
    return { status: "error", message: "Failed to terminate lease agreement" };
  }
};

export const activateLease = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    await prisma.lease.update({
      where: {
        id,
      },
      data: {
        status: "ACTIVE",
      },
    });

    revalidatePath("/admin");

    return { status: "success", message: "Lease successfully activated" };
  } catch (error) {
    return { status: "error", message: "Failed to activate lease agreement" };
  }
};

export const markLeaseAsExpired = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    await prisma.lease.update({
      where: {
        id,
      },
      data: {
        status: "EXPIRED",
      },
    });

    revalidatePath("/admin");

    return { status: "success", message: "Lease successfully expired" };
  } catch (error) {
    return { status: "error", message: "Failed to expire lease agreement" };
  }
};

export const markLeaseAsRenewed = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    await prisma.lease.update({
      where: {
        id,
      },
      data: {
        status: "RENEWED",
      },
    });

    revalidatePath("/admin");

    return { status: "success", message: "Lease successfully renewed" };
  } catch (error) {
    return { status: "error", message: "Failed to renew lease agreement" };
  }
};

export const cancelLease = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    await prisma.lease.update({
      where: {
        id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    revalidatePath("/admin");

    return { status: "success", message: "Lease successfully cancelled" };
  } catch (error) {
    return { status: "error", message: "Failed to cancel lease agreement" };
  }
};

export const markPaymentSuccessful = async (
  id: string
): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    await prisma.payment.update({
      where: {
        id,
      },
      data: {
        status: "SUCCESS",
      },
    });

    revalidatePath("/admin");

    return { status: "success", message: "Payment successfully updated" };
  } catch (error) {
    return { status: "error", message: "Failed to update payment status" };
  }
};
