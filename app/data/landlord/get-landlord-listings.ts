import "server-only";
import { requireLandlord } from "./require-landlord";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getLandlordListings = async (limit: number = 10) => {
  const { user } = await requireLandlord();

  const data = await prisma.listing.findMany({
    where: {
      userId: user.id,
      status: {
        notIn: ["Archived", "Deleted"],
      },
    },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      smallDescription: true,
      propertySize: true,
      bedrooms: true,
      bathrooms: true,
      availabilityDate: true,
      price: true,
      paymentFrequency: true,
      discount: true,
      address: true,
      state: true,
      city: true,
      country: true,
      petPolicy: true,
      smokingPolicy: true,
      partyPolicy: true,
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
    },
  });

  if (!data) return notFound();

  return data;
};

export type GetLandlordListingsType = Awaited<
  ReturnType<typeof getLandlordListings>
>[0];
