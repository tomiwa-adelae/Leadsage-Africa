"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";
import Mailjet from "node-mailjet";
import { env } from "@/lib/env";
import { onboardingRoleSelected } from "@/lib/emails/onboarding-role-selected";

const mailjet = Mailjet.apiConnect(
  env.MAILJET_API_PUBLIC_KEY,
  env.MAILJET_API_PRIVATE_KEY
);

export const selectRole = async (role: string): Promise<ApiResponse> => {
  const { user } = await requireUser();
  try {
    if (!role) return { status: "error", message: "Invalid role data" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Success",
        color: "bg-blue-400",
        title: `Role selected`,
        message: `You’ve chosen to continue as a ${role}. Your dashboard is now tailored for your needs.`,
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
          Subject: `Onboarding at Leadsage Africa.`,
          TextPart: `Welcome to your onboarding at Leadsage Africa`,
          HTMLPart: onboardingRoleSelected({
            name: user.name,
            role,
          }),
        },
      ],
    });

    revalidatePath("/notifications");

    return {
      status: "success",
      message: "Your role has been successfully updated. Redirecting...",
    };
  } catch (error) {
    return { status: "error", message: "Failed to save role" };
  }
};
