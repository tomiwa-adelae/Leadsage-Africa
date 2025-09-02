"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
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

    await prisma.application.update({
      where: {
        id,
      },
      data: {
        status: "UNDER_REVIEW",
      },
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
