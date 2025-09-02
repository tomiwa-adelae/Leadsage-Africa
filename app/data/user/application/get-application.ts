import "server-only";
import { requireUser } from "../require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getApplication = async (id: string) => {
  const { user } = await requireUser();

  const application = await prisma.application.findUnique({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
      status: true,
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
          smallDescription: true,
          bedrooms: true,
          bathrooms: true,
          propertySize: true,
          state: true,
          address: true,
          city: true,
          country: true,
          price: true,
          securityDeposit: true,
          paymentFrequency: true,
          Category: {
            select: {
              id: true,
              name: true,
            },
          },
          amenities: {
            select: {
              id: true,
              description: true,
              icon: true,
              name: true,
            },
          },
          photos: {
            select: {
              id: true,
              src: true,
              cover: true,
            },
          },
          User: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
              phoneNumber: true,
              gender: true,
              address: true,
              city: true,
              state: true,
              country: true,
              createdAt: true,
              emailVerified: true,
            },
          },
        },
      },
      User: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          phoneNumber: true,
          gender: true,
          address: true,
          city: true,
          state: true,
          country: true,
          role: true,
          preferredFirstName: true,
          mailingAddress: true,
          mailingCity: true,
          mailingState: true,
          mailingCountry: true,
          emergencyEmail: true,
          emergencyName: true,
          emergencyLanguage: true,
          emergencyPhoneNumber: true,
          emergencyRelationship: true,
          updatedAt: true,
          createdAt: true,
          emailVerified: true,
        },
      },
    },
  });

  if (!application) return notFound();

  return application;
};

export type GetApplicationType = Awaited<ReturnType<typeof getApplication>>;
