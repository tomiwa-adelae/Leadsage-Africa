"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const deleteListing = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireLandlord();

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
      },
    });

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

    if (!listing)
      return { status: "error", message: "Oops! An error occurred" };

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Delete",
        color: "bg-red-600",
        title: `Listing deleted`,
        message: `You’ve successfully deleted your listing ${
          listing.title && `"${listing.title}"`
        }.`,
      },
    });
    revalidatePath("/landlord");

    return { status: "success", message: "Listing successfully deleted." };
  } catch (error) {
    return { status: "error", message: "Failed to delete listing" };
  }
};

export const draftListing = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireLandlord();

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
      },
    });

    if (listing?.Lease[0].status === "ACTIVE")
      return {
        status: "error",
        message:
          "Oops! You cannot draft this listing as it is currently occupied",
      };

    await prisma.listing.update({
      where: {
        id,
      },
      data: {
        status: "Draft",
        isApproved: false,
      },
    });

    if (!listing)
      return { status: "error", message: "Oops! An error occurred" };

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Listing",
        color: "bg-red-600",
        title: `Listing drafted`,
        message: `You’ve successfully drafted your listing "${listing.title}".`,
      },
    });

    revalidatePath("/landlord");

    return { status: "success", message: "Listing successfully drafted." };
  } catch (error) {
    return { status: "error", message: "Failed to draft listing" };
  }
};

export const signLease = async (
  id: string,
  signature: string
): Promise<ApiResponse> => {
  await requireLandlord();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    await prisma.lease.update({
      where: {
        id,
      },
      data: {
        landlordSignature: signature,
      },
    });

    revalidatePath("/landlord");

    return { status: "success", message: "Lease successfully siged" };
  } catch (error) {
    return { status: "error", message: "Failed to sign lease agreement" };
  }
};
