"use server";

import { ApiResponse } from "@/lib/types";
import { requireUser } from "./data/user/require-user";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

import Mailjet from "node-mailjet";
import { env } from "@/lib/env";
import { accountCreationSuccess } from "@/lib/emails/account-creation-success";
import { contactFormSchema, ContactFormSchemaType } from "@/lib/zodSchemas";
import { contactAdmin } from "@/lib/emails/contact-admin";

const mailjet = Mailjet.apiConnect(
  env.MAILJET_API_PUBLIC_KEY,
  env.MAILJET_API_PRIVATE_KEY
);

export const saveProfilePicture = async (
  value: string
): Promise<ApiResponse> => {
  const { user } = await requireUser();
  try {
    if (!value) return { status: "error", message: "Invalid profile picture" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        image: value,
      },
    });

    revalidatePath("/onboarding");

    return {
      status: "success",
      message: "Your profile picture has been successfully updated.",
    };
  } catch (error) {
    return {
      status: "error",
      message: " Failed to upload your profile picture",
    };
  }
};

export const saveListing = async (id: string): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    const listing = await prisma.listing.findUnique({
      where: {
        id,
      },
      select: {
        title: true,
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!listing)
      return { status: "error", message: "Oops! An error occurred" };

    await prisma.savedListing.create({
      data: {
        userId: user.id,
        listingId: id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Save",
        color: "bg-red-600",
        title: "Listing saved",
        message: `You saved "${listing?.title}" to your favorites. You can view it anytime in your saved listings.`,
      },
    });

    await prisma.notification.create({
      data: {
        userId: listing.User.id,
        type: "Save",
        color: "bg-red-600",
        title: "Your listing got attention",
        message: `${user.name} added "${listing?.title} " to their favorites.`,
      },
    });

    revalidatePath("/listings");
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/notifications");
    revalidatePath("/saved-properties");

    return { status: "success", message: "Listing successfully saved!" };
  } catch (error) {
    return { status: "error", message: "Failed to save listing" };
  }
};

export const removeSavedListing = async (
  id: string,
  listingId: string
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred!" };

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      select: {
        title: true,
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!listing)
      return { status: "error", message: "Oops! An error occurred" };

    await prisma.savedListing.delete({
      where: {
        id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Delete",
        color: "bg-primary",
        title: "Listing removed",
        message: `You removed "${listing?.title}" to your favorites.`,
      },
    });

    revalidatePath("/listings");
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/notifications");
    revalidatePath("/saved-properties");

    return { status: "success", message: "Listing successfully removed!" };
  } catch (error) {
    return { status: "error", message: "Failed to remove listing" };
  }
};

export const triggerAppearanceNotifications = async (
  theme: string
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Appearance",
        color: "bg-blue-400",
        title: `Theme updated`,
        message: `You switched your appearance settings to ${theme} Mode.`,
      },
    });

    revalidatePath("/notifications");
    return { status: "success", message: "Update successful" };
  } catch (error) {
    return { status: "error", message: "Failed to create notification" };
  }
};

export const triggerUserCreationNotifications =
  async (): Promise<ApiResponse> => {
    const { user } = await requireUser();

    try {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: "Welcome",
          color: "bg-blue-400",
          title: `Welcome to Leadsage Africa`,
          message: `Your account has been successfully created. Let’s get you started.`,
        },
      });

      await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: env.SENDER_EMAIL_ADDRESS,
              Name: "Leadsage Africa",
            },
            To: [
              {
                Email: user.email,
                Name: user.name,
              },
            ],
            ReplyTo: {
              Email: env.SENDER_EMAIL_ADDRESS,
              Name: "Leadsage Support",
            },
            Subject: `Welcome to Leadsage Africa. Your Housing Journey Starts Here`,
            TextPart: `Welcome to Leadsage Africa`,
            HTMLPart: accountCreationSuccess({
              name: user.name,
            }),
          },
        ],
      });

      revalidatePath("/notifications");
      return { status: "success", message: "Update successful" };
    } catch (error) {
      return { status: "error", message: "Failed to create notification" };
    }
  };

export const contactUs = async (
  data: ContactFormSchemaType
): Promise<ApiResponse> => {
  try {
    const validation = contactFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.contact.create({
      data: {
        ...validation.data,
      },
    });

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Africa",
          },
          To: [
            {
              Email: env.ADMIN_EMAIL_ADDRESS,
              Name: "Leadsage Africa Admin",
            },
          ],
          ReplyTo: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Support",
          },
          Subject: `New Contact Form Submission – Leadsage Africa`,
          TextPart: `New Contact Form Submission – Leadsage Africa`,
          HTMLPart: contactAdmin({
            ...validation.data,
          }),
        },
      ],
    });

    return {
      status: "success",
      message:
        "Thanks for reaching out! Our team will get back to you within 24 hours.",
    };
  } catch (error) {
    return { status: "error", message: " Failed to send message" };
  }
};
