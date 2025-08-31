import "server-only";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireAdmin } from "../require-admin";

export const getAdminBooking = async (id: string) => {
  await requireAdmin();
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
          email: true,
          phoneNumber: true,
          bio: true,
        },
      },
      listing: {
        select: {
          id: true,
          slug: true,
          title: true,
          address: true,
          city: true,
          state: true,
          country: true,
          listingId: true,
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
              id: true,
              name: true,
              image: true,
              emailVerified: true,
              email: true,
              phoneNumber: true,
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

export type GetAdminBookingType = Awaited<ReturnType<typeof getAdminBooking>>;
