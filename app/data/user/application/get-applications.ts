import "server-only";
import { requireUser } from "../require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getApplications = async () => {
  const { user } = await requireUser();

  const applications = await prisma.application.findMany({
    where: {
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
      createdAt: true,
      status: true,
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

  // if (!application) return notFound();

  return applications;
};

export type GetApplicationsType = Awaited<
  ReturnType<typeof getApplications>
>[0];
