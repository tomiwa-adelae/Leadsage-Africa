"use server";

import { requireLandlord } from "@/app/data/landlord/require-landlord";
import { prisma } from "@/lib/db";
import { landlordSignedLeaseAdmin } from "@/lib/emails/landlord-signed-lease-admin";
import { landlordSignedLeaseLandlord } from "@/lib/emails/landlord-signed-lease-landlord";
import { landlordSignedLeaseTenant } from "@/lib/emails/landlord-signed-lease-tenant";
import { env } from "@/lib/env";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

import Mailjet from "node-mailjet";
const mailjet = Mailjet.apiConnect(
  env.MAILJET_API_PUBLIC_KEY,
  env.MAILJET_API_PRIVATE_KEY
);

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

    if (listing?.Lease[0]?.status === "ACTIVE")
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

    if (listing?.Lease[0]?.status === "ACTIVE")
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
  const { user } = await requireLandlord();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    const lease = await prisma.lease.update({
      where: {
        id,
      },
      data: {
        landlordSignature: signature,
      },
      select: {
        leaseId: true,
        User: {
          select: {
            name: true,
            email: true,
          },
        },
        Listing: {
          select: {
            address: true,
            city: true,
            state: true,
            country: true,
            User: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const location = `${lease.Listing?.address!}, ${lease.Listing
      ?.city!}, ${lease.Listing?.state!}, ${lease.Listing?.country!}`;

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Africa",
          },
          To: [
            {
              Email: lease.User.email,
              Name: lease.User.name,
            },
          ],
          ReplyTo: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Support",
          },
          Subject: `Leadsage Africa – Lease Agreement Complete`,
          TextPart: `Leadsage Africa – Lease Agreement Complete`,
          HTMLPart: landlordSignedLeaseTenant({
            name: lease.User.name,
            id: lease.leaseId,
            location,
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
              Email: lease.Listing.User.email,
              Name: lease.Listing.User.name,
            },
          ],
          ReplyTo: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Support",
          },
          Subject: `Leadsage Africa – Lease Agreement Complete`,
          TextPart: `Leadsage Africa – Lease Agreement Complete`,
          HTMLPart: landlordSignedLeaseLandlord({
            landlordName: lease.Listing.User.name,
            location,
            id: lease.leaseId,
            tenantName: lease.User.name,
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
          Subject: `Leadsage Africa – Lease Signed`,
          TextPart: `Leadsage Africa – Lease Signed`,
          HTMLPart: landlordSignedLeaseAdmin({
            id: lease.leaseId,
            landlordName: lease.Listing.User.name,
            location,
            tenantName: lease.User.name,
          }),
        },
      ],
    });

    revalidatePath("/landlord");

    return { status: "success", message: "Lease successfully siged" };
  } catch (error) {
    return { status: "error", message: "Failed to sign lease agreement" };
  }
};
