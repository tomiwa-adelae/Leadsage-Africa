import "server-only";
import { requireUser } from "../require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getShortletDetails = async (id: string) => {
  const { user } = await requireUser();

  const application = await prisma.shortletBooking.findUnique({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
      status: true,
      checkInDate: true,
      checkOutDate: true,
      totalPrice: true,
      shortletID: true,
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
          availabilityDate: true,
          petPolicy: true,
          smokingPolicy: true,
          partyPolicy: true,
          additionalPolicies: true,
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

export type GetShortletDetailsType = Awaited<
  ReturnType<typeof getShortletDetails>
>;
