import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import "server-only";

export const getListingDetails = async (slug: string) => {
  const listing = await prisma.listing.findUnique({
    where: {
      slug,
      Lease: {
        none: {
          status: "ACTIVE",
        },
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      smallDescription: true,
      propertySize: true,
      bedrooms: true,
      bathrooms: true,
      availabilityDate: true,
      petPolicy: true,
      smokingPolicy: true,
      partyPolicy: true,
      additionalPolicies: true,
      price: true,
      securityDeposit: true,
      paymentFrequency: true,
      discount: true,
      address: true,
      state: true,
      city: true,
      country: true,
      postalCode: true,
      status: true,
      isApproved: true,
      Category: {
        select: {
          name: true,
          id: true,
          description: true,
          icon: true,
        },
      },
      amenities: {
        select: {
          icon: true,
          id: true,
          name: true,
          description: true,
        },
      },
      photos: {
        select: {
          id: true,
          cover: true,
          src: true,
        },
      },
      User: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
        },
      },
    },
  });

  if (!listing) return notFound();

  return listing;
};

export type GetListingPreviewType = Awaited<
  ReturnType<typeof getListingDetails>
>;
