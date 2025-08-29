import "server-only";
import { requireUser } from "./require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getUserInfo = async () => {
  const session = await requireUser();

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
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
      bookingNotifications: true,
      listingNotifications: true,
      promotionalNotifications: true,
      accountNotifications: true,
      accounts: {
        select: {
          id: true,
          accountId: true,
          providerId: true,
          password: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!user) return notFound();

  return user;
};

export type GetUserInfoType = Awaited<ReturnType<typeof getUserInfo>>;
