import "server-only";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireLandlord } from "../require-landlord";

export const getApplications = async () => {
  const { user } = await requireLandlord();

  const application = await prisma.application.findMany({
    where: {
      Listing: {
        userId: user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
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

export type GetApplicationsType = Awaited<
  ReturnType<typeof getApplications>
>[0];
