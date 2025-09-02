import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";

export const getPendingReviewApplicaitons = async () => {
  await requireAdmin();

  const listings = await prisma.application.findMany({
    where: {
      status: "UNDER_REVIEW",
    },
    select: {
      id: true,
      currentLandlordPhoneNumber: true,
      currentLandlordEmail: true,
      currentLandlordName: true,
      employerEmail: true,
      employerName: true,
      employerPhoneNumber: true,
      employmentStatus: true,
      govermentID: true,
      jobTitle: true,
      monthlyIncome: true,
      proofOfEmployment: true,
      proofOfIncome: true,
      reasonsForMoving: true,
      createdAt: true,
      status: true,
      User: {
        select: {
          name: true,
        },
      },
      Listing: {
        select: {
          title: true,
          slug: true,
          photos: {
            select: {
              id: true,
              cover: true,
              src: true,
            },
          },
          User: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return listings;
};

export type GetPendingReviewApplicationType = Awaited<
  ReturnType<typeof getPendingReviewApplicaitons>
>[0];
