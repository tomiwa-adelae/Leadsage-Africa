import "server-only";
import { requireLandlord } from "./require-landlord";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getLandlordBooking = async (id: string) => {
  await requireLandlord;
  const booking = await prisma.booking.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      bookingId: true,
      createdAt: true,
      date: true,
      timeSlot: true,
      updatedAt: true,
      notes: true,
      status: true,
      confirmedBy: true,
      cancelledBy: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          emailVerified: true,
          bio: true,
        },
      },
      listing: {
        select: {
          id: true,
          title: true,
          address: true,
          city: true,
          state: true,
          country: true,
          price: true,
          createdAt: true,
          updatedAt: true,
          smallDescription: true,
          propertySize: true,
          bedrooms: true,
          bathrooms: true,
          photos: {
            select: {
              id: true,
              cover: true,
              src: true,
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
        },
      },
    },
  });

  if (!booking) return notFound();

  return booking;
};

export type GetLandlordBookingType = Awaited<
  ReturnType<typeof getLandlordBooking>
>;
