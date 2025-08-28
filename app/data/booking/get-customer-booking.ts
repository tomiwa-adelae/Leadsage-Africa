import "server-only";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireUser } from "../user/require-user";

export const getCustomerBooking = async (id: string) => {
  await requireUser;
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
          User: {
            select: {
              image: true,
              name: true,
              emailVerified: true,
              bio: true,
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
  ReturnType<typeof getCustomerBooking>
>;
