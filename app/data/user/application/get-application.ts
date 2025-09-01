import "server-only";
import { requireUser } from "../require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getApplication = async (id: string) => {
  await requireUser();

  const application = await prisma.application.findUnique({
    where: {
      id,
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
    },
  });

  if (!application) return notFound();

  return application;
};

export type GetApplicationType = Awaited<ReturnType<typeof getApplication>>;
