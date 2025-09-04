import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getListing = async (slug: string) => {
  await requireAdmin();

  const listing = await prisma.listing.findFirst({
    where: {
      OR: [{ slug: slug }, { id: slug }],
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
      listingId: true,
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
      createdAt: true,
      updatedAt: true,
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
          email: true,
          emailVerified: true,
          phoneNumber: true,
          bio: true,
        },
      },
      Lease: {
        where: {
          status: "ACTIVE",
        },
        select: {
          status: true,
        },
      },
    },
  });

  if (!listing) return notFound();
  return listing;
};

export type GetListingType = Awaited<ReturnType<typeof getListing>>;
