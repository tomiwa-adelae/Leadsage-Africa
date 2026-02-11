"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { applicationSubmittedAdmin } from "@/lib/emails/application-submitted-admin";
import { applicationSubmittedLandlord } from "@/lib/emails/application-submitted-landlord";
import { applicationSubmittedTenant } from "@/lib/emails/application-submitted-tenant";
import { env } from "@/lib/env";
import { ApiResponse } from "@/lib/types";
import { sanitizePhoneNumber } from "@/lib/utils";
import {
  documentsFormSchema,
  documentsFormSchemaType,
  employmentFormSchema,
  EmploymentFormSchemaType,
  personalInformationFormSchema,
  PersonalInformationFormSchemaType,
  rentalHistoryFormSchema,
  RentalHistoryFormSchemaType,
  termsAndAgreementFormSchema,
  TermsAndAgreementFormSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

import Mailjet from "node-mailjet";
const mailjet = Mailjet.apiConnect(
  env.MAILJET_API_PUBLIC_KEY,
  env.MAILJET_API_PRIVATE_KEY,
);

export const updateProfile = async (
  data: PersonalInformationFormSchemaType,
  listingId: string,
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
  id: string,
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
  id: string,
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
  id: string,
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

export const processKycAndCreateWallet = async (
  data: documentsFormSchemaType,
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = documentsFormSchema.safeParse(data);
    if (!validation.success) {
      return { status: "error", message: "Invalid verification data." };
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return { status: "error", message: "User not found." };

    const { dob, bvn, idType, idNumber, idImage } = validation.data;
    const anchorPhone = sanitizePhoneNumber(
      dbUser.phoneNumber || "08000000000",
    );

    // Name Parsing
    const nameParts = (dbUser.name || "User").trim().split(" ");
    const firstName = nameParts[0];
    const lastName =
      nameParts.length > 1 ? nameParts[nameParts.length - 1] : "Customer";
    const middleName =
      nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

    // STEP 1: Create Anchor Customer
    const customerResponse = await fetch(
      "https://api.sandbox.getanchor.co/api/v1/customers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-anchor-key": env.ANCHOR_SECRET_KEY,
        },
        body: JSON.stringify({
          data: {
            type: "IndividualCustomer",
            attributes: {
              fullName: { firstName, lastName, middleName },
              address: {
                addressLine_1: dbUser.address || "1, Street Address",
                city: dbUser.city || "Ikeja",
                state: dbUser.state || "Lagos",
                postalCode: "100001",
                country: "NG",
              },
              email: dbUser.email,
              phoneNumber: anchorPhone,
              identificationLevel2: {
                dateOfBirth: dob,
                gender: dbUser?.gender,
                bvn,
              },
            },
          },
        }),
      },
    );

    const customerJson = await customerResponse.json();
    if (!customerResponse.ok) {
      return {
        status: "error",
        message:
          customerJson.errors?.[0]?.detail || "Customer creation failed.",
      };
    }

    const anchorCustomerId = customerJson.data.id;

    const verifyResponse = await fetch(
      `https://api.sandbox.getanchor.co/api/v1/customers/${anchorCustomerId}/verification/individual`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-anchor-key": env.ANCHOR_SECRET_KEY,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              level: "TIER_2",
              level2: {
                bvn,
                dateOfBirth: dob,
                gender: dbUser?.gender,
              },
            },
            type: "Verification",
          },
        }),
      },
    );

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      return {
        status: "error",
        message: `Anchor Verification Failed: ${errorData.errors?.[0]?.detail || "Unknown error"}`,
      };
    }

    // STEP 2: Create Deposit Account (Wallet)
    const walletResponse = await fetch(
      "https://api.sandbox.getanchor.co/api/v1/accounts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-anchor-key": env.ANCHOR_SECRET_KEY,
        },
        body: JSON.stringify({
          data: {
            type: "DepositAccount",
            attributes: { productName: "SAVINGS" },
            relationships: {
              customer: {
                data: { id: anchorCustomerId, type: "IndividualCustomer" },
              },
            },
          },
        }),
      },
    );

    const walletJson = await walletResponse.json();

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          kycTier: 2,
          anchorId: anchorCustomerId,
          walletId: walletJson.data.id,
          walletAccountNo: walletJson.data.attributes.accountNumber,
          walletAccountName: walletJson.data.attributes.accountName,
          walletBankName: walletJson.data.attributes.bank.name,
          walletBankCode: walletJson.data.attributes.bank.nipCode,
          walletStatus: walletJson.data.attributes.status,
          walletCurrency: walletJson.data.attributes.currency,
        },
      }),

      prisma.kyc.upsert({
        where: { userId: user.id },
        update: {
          anchorCustomerId: anchorCustomerId,
          bvn: bvn, // Save the BVN here too
          dateOfBirth: dob,
          idType,
          idNumber,
          idImage,
          status: "PENDING",
        },
        create: {
          userId: user.id,
          anchorCustomerId: anchorCustomerId,
          bvn: bvn,
          dateOfBirth: dob,
          idType,
          idNumber,
          idImage,
          status: "PENDING",
        },
      }),
    ]);

    revalidatePath("/");

    return {
      status: "success",
      message: "Identity submitted and wallet generated.",
    };
  } catch (error) {
    console.error("KYC_ACCOUNT_ERROR", error);
    return { status: "error", message: "An unexpected error occurred." };
  }
};
