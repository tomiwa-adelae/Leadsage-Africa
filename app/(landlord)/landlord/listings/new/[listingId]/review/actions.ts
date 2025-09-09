"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

import Mailjet from "node-mailjet";
import { env } from "@/lib/env";
import { listingSubmittedLandlord } from "@/lib/emails/listing-submitted-landlord";
import { listingSubmittedAdmin } from "@/lib/emails/listing-submitted-admin";
const mailjet = Mailjet.apiConnect(
  env.MAILJET_API_PUBLIC_KEY,
  env.MAILJET_API_PRIVATE_KEY
);

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
        slug: true,
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
          Subject: `Leadsage Africa – Listing Submitted`,
          TextPart: `Leadsage Africa – Listing Submitted`,
          HTMLPart: listingSubmittedLandlord({
            property: listing.title!,
            landlordName: user.name,
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
          Subject: `Leadsage Africa – New Listing Pending Approval`,
          TextPart: `Leadsage Africa – New Listing pending approval`,
          HTMLPart: listingSubmittedAdmin({
            property: listing.title!,
            landlordName: user.name,
            slug: listing.slug!,
          }),
        },
      ],
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
