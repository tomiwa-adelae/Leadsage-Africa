import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";

export const getUserById = async (userId: string) => {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      preferredFirstName: true,
      email: true,
      emailVerified: true,
      image: true,
      phoneNumber: true,
      gender: true,
      address: true,
      city: true,
      state: true,
      country: true,
      mailingAddress: true,
      mailingCity: true,
      mailingState: true,
      mailingCountry: true,
      bio: true,
      emergencyName: true,
      emergencyRelationship: true,
      emergencyLanguage: true,
      emergencyEmail: true,
      emergencyPhoneNumber: true,
      bookingNotifications: true,
      listingNotifications: true,
      promotionalNotifications: true,
      accountNotifications: true,
      createdAt: true,
      updatedAt: true,
      onboardingCompleted: true,
      role: true,
      banned: true,
      banReason: true,
      banExpires: true,
      _count: {
        select: {
          listing: true,
          booking: true,
          application: true,
          lease: true,
          savedListing: true,
          notification: true,
          payment: true,
        },
      },
      listing: {
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          listingId: true,
          status: true,
          price: true,
          city: true,
          state: true,
          createdAt: true,
          photos: {
            select: {
              id: true,
              src: true,
              cover: true,
            },
          },
        },
      },
      booking: {
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          bookingId: true,
          date: true,
          timeSlot: true,
          status: true,
          createdAt: true,
          listing: {
            select: {
              title: true,
              listingId: true,
            },
          },
        },
      },
      application: {
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          Listing: {
            select: {
              title: true,
              listingId: true,
            },
          },
        },
      },
      lease: {
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          leaseId: true,
          status: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          Listing: {
            select: {
              title: true,
              listingId: true,
            },
          },
        },
      },
    },
  });

  return user;
};

export type GetUserByIdType = Awaited<ReturnType<typeof getUserById>>;
