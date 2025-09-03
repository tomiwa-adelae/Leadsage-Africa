import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";

export const getExpiredLeases = async () => {
  await requireAdmin();

  const listings = await prisma.lease.findMany({
    where: {
      status: "EXPIRED",
    },
    select: {
      id: true,
      leaseId: true,
      createdAt: true,
      endDate: true,
      startDate: true,
      depositStatus: true,
      landlordSignature: true,
      tenantSignature: true,
      moveInDate: true,
      status: true,
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

  return listings;
};

export type GetExpiredLeasesType = Awaited<
  ReturnType<typeof getExpiredLeases>
>[0];
