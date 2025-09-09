"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { leaseSignPromptLandlord } from "@/lib/emails/lease-sign-prompt-landlord";
import { leaseSignedAdmin } from "@/lib/emails/lease-signed-admin";
import { leaseSignedTenant } from "@/lib/emails/lease-signed-tenant";
import { env } from "@/lib/env";
import { generateSuffix } from "@/lib/utils";

import Mailjet from "node-mailjet";
const mailjet = Mailjet.apiConnect(
  env.MAILJET_API_PUBLIC_KEY,
  env.MAILJET_API_PRIVATE_KEY
);

export const acceptAgreement = async (data: {
  moveInDate: string;
  startDate: string;
  endDate: string;
  signature: string;
  id: string;
}) => {
  const { user } = await requireUser();

  try {
    if (!data.moveInDate)
      return { status: "error", message: "Please select your move-in date" };
    if (!data.startDate)
      return { status: "error", message: "Oops! An error occurred" };
    if (!data.endDate)
      return { status: "error", message: "Oops! An error occurred" };

    if (!data.signature)
      return {
        status: "error",
        message: "Please your signature is required to proceed",
      };

    const application = await prisma.application.findUnique({
      where: {
        id: data.id,
      },
      select: {
        Listing: {
          select: {
            address: true,
            city: true,
            country: true,
            state: true,
            id: true,
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

    if (!application)
      return { status: "error", message: "Oops! An error occurred!" };

    const existingLease = await prisma.lease.findFirst({
      where: {
        listingId: application.Listing.id,
        status: "PENDING",
      },
    });

    if (existingLease)
      return {
        status: "error",
        message:
          "Oops! Someone else already signed a lease for this property. Please contact our support",
      };

    const listing = await prisma.listing.findUnique({
      where: {
        id: application.Listing.id,
      },
      select: {
        Lease: {
          where: {
            status: "ACTIVE",
          },
        },
      },
    });

    if (listing?.Lease.length !== 0)
      return {
        status: "error",
        message: "Oops! You cannot sign an already active lease.",
      };

    const year = new Date().getFullYear();
    let suffix = generateSuffix();
    let leaseId = `LEASE-${year}-${suffix}`;

    let existing = await prisma.lease.findFirst({
      where: {
        leaseId,
      },
    });

    while (existing) {
      suffix = generateSuffix();
      leaseId = `LEASE-${year}-${suffix}`;
      existing = await prisma.lease.findFirst({
        where: {
          leaseId,
        },
      });
    }

    const lease = await prisma.lease.create({
      data: {
        endDate: data.endDate,
        startDate: data.startDate,
        moveInDate: data.moveInDate,
        listingId: application?.Listing.id,
        userId: user.id,
        leaseId,
        tenantSignature: data.signature,
      },
    });

    const location = `${application.Listing?.address!}, ${application.Listing
      ?.city!}, ${application.Listing?.state!}, ${application.Listing
      ?.country!}`;

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
          Subject: `Leadsage Africa – Agreement Signed`,
          TextPart: `Leadsage Africa – Agreement Signed`,
          HTMLPart: leaseSignedTenant({
            name: user.name,
            id: leaseId,
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
              Email: application.Listing.User.email,
              Name: application.Listing.User.name,
            },
          ],
          ReplyTo: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Support",
          },
          Subject: `Leadsage Africa – Agreement Pending`,
          TextPart: `Leadsage Africa – Agreement Pending`,
          HTMLPart: leaseSignPromptLandlord({
            landlordName: application.Listing.User.name,
            location,
            id: leaseId,
            tenantName: user.name,
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
          HTMLPart: leaseSignedAdmin({
            tenantName: user.name,
            id: leaseId,
            location,
          }),
        },
      ],
    });

    return {
      status: "success",
      message:
        "Lease signed successfully. Waiting for landlord countersignature.",
      data: lease,
    };
  } catch (error) {
    return { status: "error", message: "Failed to sign lease" };
  }
};
