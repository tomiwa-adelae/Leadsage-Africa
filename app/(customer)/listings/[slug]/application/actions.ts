"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { applicationSubmittedAdmin } from "@/lib/emails/application-submitted-admin";
import { applicationSubmittedLandlord } from "@/lib/emails/application-submitted-landlord";
import { applicationSubmittedTenant } from "@/lib/emails/application-submitted-tenant";
import { env } from "@/lib/env";
import { ApiResponse } from "@/lib/types";
import {
  employmentFormSchema,
  EmploymentFormSchemaType,
  personalInformationFormSchema,
  PersonalInformationFormSchemaType,
  rentalHistoryFormSchema,
  RentalHistoryFormSchemaType,
  termsAndAgreementFormSchema,
  TermsAndAgreementFormSchemaType,
} from "@/lib/zodSchemas";

import Mailjet from "node-mailjet";
const mailjet = Mailjet.apiConnect(
  env.MAILJET_API_PUBLIC_KEY,
  env.MAILJET_API_PRIVATE_KEY
);

export const updateProfile = async (
  data: PersonalInformationFormSchemaType,
  listingId: string
) => {
  const { user } = await requireUser();

  try {
    if (!listingId)
      return { status: "error", message: "Oops! An error occurred" };
    const validation = personalInformationFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...validation.data,
      },
    });

    const application = await prisma.application.create({
      data: {
        userId: user.id,
        listingId: listingId,
      },
    });

    if (!application)
      return { status: "error", message: "Oops! An error occurred" };

    return {
      status: "success",
      message: "Personal information successfully saved",
      data: application,
    };
  } catch (error) {
    return { status: "error", message: "Failed to save personal information" };
  }
};

export const updateEmploymentDetails = async (
  data: EmploymentFormSchemaType,
  id: string
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const validation = employmentFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.application.update({
      where: {
        id,
      },
      data: {
        ...validation.data,
      },
    });

    return {
      status: "success",
      message: "Employment details successfully saved",
    };
  } catch (error) {
    return { status: "error", message: "Failed to save employment details" };
  }
};

export const updateRentalHistory = async (
  data: RentalHistoryFormSchemaType,
  id: string
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const validation = rentalHistoryFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.application.update({
      where: {
        id,
      },
      data: {
        ...validation.data,
      },
    });

    return {
      status: "success",
      message: "Rental history details successfully saved",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to save rental history details",
    };
  }
};

export const submitApplication = async (
  data: TermsAndAgreementFormSchemaType,
  id: string
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    if (!id) return { status: "error", message: "Oops! An error occurred" };

    const validation = termsAndAgreementFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    const application = await prisma.application.update({
      where: {
        id,
      },
      data: {
        status: "UNDER_REVIEW",
      },
      select: {
        id: true,
        Listing: {
          select: {
            address: true,
            city: true,
            state: true,
            country: true,
            User: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const location = `${application.Listing?.address!}, ${application.Listing
      ?.city!}, ${application.Listing?.state!}, ${application.Listing
      ?.country!}`;

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
          Subject: `Application Submitted`,
          TextPart: `Application successful - Leadsage`,
          HTMLPart: applicationSubmittedTenant({
            name: user.name,
            location,
            landlordName: application.Listing.User.name,
            id: application.id,
          }),
        },
      ],
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
              Email: application.Listing.User.email,
              Name: application.Listing.User.name,
            },
          ],
          ReplyTo: {
            Email: env.SENDER_EMAIL_ADDRESS,
            Name: "Leadsage Support",
          },
          Subject: `New Rental Application | Leadsage Africa`,
          TextPart: `Leadsage Africa – New Rental Application`,
          HTMLPart: applicationSubmittedLandlord({
            landlordName: application.Listing.User.name,
            tenantName: user.name,
            location,
            id: application.id,
          }),
        },
      ],
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
          Subject: `New Application Alert | Leadsage Africa`,
          TextPart: `Leadsage Africa – New Application Alert`,
          HTMLPart: applicationSubmittedAdmin({
            landlordName: application.Listing.User.name,
            tenantName: user.name,
            location,
            id: application.id,
          }),
        },
      ],
    });

    return {
      status: "success",
      message: "Application successfully submitted",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to submit application",
    };
  }
};
