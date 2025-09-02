import "server-only";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireLandlord } from "../require-landlord";

export const getReviewingApplications = async () => {
  const { user } = await requireLandlord();

  const application = await prisma.application.findMany({
    where: {
      status: "UNDER_REVIEW",
      Listing: {
        userId: user.id,
      },
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
      Listing: {
        select: {
          title: true,
          slug: true,
        },
      },
      User: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!application) return notFound();

  return application;
};

export type GetReviewingApplicationsType = Awaited<
  ReturnType<typeof getReviewingApplications>
>[0];
