"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const publishListing = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireLandlord();
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
