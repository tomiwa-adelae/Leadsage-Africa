import "server-only";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireLandlord } from "../require-landlord";

export const getLeaseDetails = async (id: string) => {
  const { user } = await requireLandlord();

  const lease = await prisma.lease.findFirst({
    where: {
      Listing: {
        userId: user.id,
      },
      OR: [{ id: id }, { leaseId: id }],
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

  if (!lease) return notFound();

  return lease;
};

export type GetLeaseDetailsType = Awaited<ReturnType<typeof getLeaseDetails>>;
