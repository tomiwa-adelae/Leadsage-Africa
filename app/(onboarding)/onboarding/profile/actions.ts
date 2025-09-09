"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { onboardingSuccessEmail } from "@/lib/emails/onboarding-success-email";
import { env } from "@/lib/env";
import { ApiResponse } from "@/lib/types";
import {
  editProfileFormSchema,
  EditProfileFormSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

import Mailjet from "node-mailjet";
const mailjet = Mailjet.apiConnect(
  env.MAILJET_API_PUBLIC_KEY,
  env.MAILJET_API_PRIVATE_KEY
);

export const editProfile = async (
  data: EditProfileFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();
  try {
    const validation = editProfileFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid form data" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
        onboardingCompleted: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Success",
        color: "bg-blue-400",
        title: `Onboarding complete`,
        message: `Great job! You’ve completed your onboarding. You can now start exploring and using your dashboard.`,
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
          Subject: `Onboarding Success | Leadsage Africa.`,
          TextPart: `Your onboarding at Leadsage Africa is now complete`,
          HTMLPart: onboardingSuccessEmail({
            name: user.name,
            role: user.role,
          }),
        },
      ],
    });

    revalidatePath("/notifications");

    return {
      status: "success",
      message: "Your profile has been successfully updated. Redirecting...",
    };
  } catch (error: any) {
    return {
      status: "error",
      message:
        error.code === "P2002"
          ? "This email is already in use. Please choose another one."
          : "Failed to update profile.",
    };
  }
};
