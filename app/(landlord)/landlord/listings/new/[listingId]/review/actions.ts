"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const publishListing = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireLandlord();
  try {
    await prisma.listing.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        status: "Published",
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Pending",
        color: "bg-blue-600",
        title: `Listing submitted for review`,
        message: `Your listing has been submitted to our team for review. You’ll be notified once it’s approved.`,
      },
    });

    revalidatePath("/notifications");

    return {
      status: "success",
      message: "Listing successfully published. Redirecting...",
    };
  } catch (error) {
    return { status: "error", message: "Failed to publish the listing." };
  }
};

// // Approved Notification
// await prisma.notification.create({
// 			  data: {
// 				userId: user.id,
// 				type: "Success",
// 				color: "bg-green-600",
// 				title: `Listing approved`,
// 				message: `Congratulations! Your listing has been approved and is now visible to renters.`,
// 			  },
// 			});

// 			revalidatePath("/notifications");

// Rejected Notification
// await prisma.notification.create({
// 			  data: {
// 				userId: user.id,
// 				type: "Warning",
// 				color: "bg-yellow-500",
// 				title: `Listing requires changes`,
// 				message: `Your listing couldn’t be approved. Please review the feedback and update your listing.`,
// 			  },
// 			});

// 			revalidatePath("/notifications");
// Archive Notification
// await prisma.notification.create({
// 			  data: {
// 				userId: user.id,
// 				type: "Archive",
// 				color: "bg-muted",
// 				title: `Listing archived`,
// 				message: `Your listing has been archived. It’s no longer visible to renters but can be re-published later.`,
// 			  },
// 			});

// 			revalidatePath("/notifications");
