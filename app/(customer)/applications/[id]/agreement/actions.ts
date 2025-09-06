"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { generateSuffix } from "@/lib/utils";

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
            id: true,
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

    return {
      status: "success",
      message:
        "Lease signed successfully. Waiting for landlord countersignature.",
      data: lease,
    };
  } catch (error) {
    console.log(error);
    return { status: "error", message: "Failed to sign lease" };
  }
};
