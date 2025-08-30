"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
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
