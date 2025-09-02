import "server-only";
import { requireUser } from "../require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getApprovedApplications = async () => {
  const { user } = await requireUser();

  const application = await prisma.application.findMany({
    where: {
      status: "APPROVED",
      userId: user.id,
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
    },
  });

  if (!application) return notFound();

  return application;
};

export type GetApprovedApplicationsType = Awaited<
  ReturnType<typeof getApprovedApplications>
>[0];
