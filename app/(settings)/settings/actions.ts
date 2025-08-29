"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  editAddressFormSchema,
  EditAddressFormSchemaType,
  editEmailFormSchema,
  EditEmailFormSchemaType,
  editEmergencyFormSchema,
  EditEmergencyFormSchemaType,
  editLegalNamesFormSchema,
  EditLegalNamesFormSchemaType,
  editMailingAddressFormSchema,
  EditMailingAddressFormSchemaType,
  editPhoneNumberFormSchema,
  EditPhoneNumberFormSchemaType,
  editPreferredFirstNameFormSchema,
  EditPreferredFirstNameFormSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

export const saveLegalNames = async (
  data: EditLegalNamesFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editLegalNamesFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    revalidatePath("/settings");

    return { status: "success", message: "Legal names successfully saved" };
  } catch (error) {
    return { status: "error", message: "Failed to save name" };
  }
};

export const savePreferredFirstName = async (
  data: EditPreferredFirstNameFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editPreferredFirstNameFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    revalidatePath("/settings");

    return {
      status: "success",
      message: "Preferred first name successfully saved",
    };
  } catch (error) {
    return { status: "error", message: "Failed to save preferred first name" };
  }
};

export const saveEmail = async (
  data: EditEmailFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editEmailFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    revalidatePath("/settings");

    return {
      status: "success",
      message: "Email successfully saved",
    };
  } catch (error: any) {
    return {
      status: "error",
      message:
        error.code === "P2002"
          ? "This email is already in use. Please choose another one."
          : "Failed to save email",
    };
  }
};

export const savePhoneNumber = async (
  data: EditPhoneNumberFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editPhoneNumberFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    revalidatePath("/settings");

    return {
      status: "success",
      message: "Phone number successfully saved",
    };
  } catch (error: any) {
    return {
      status: "error",
      message: "Failed to save phone number",
    };
  }
};

export const saveAddress = async (
  data: EditAddressFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editAddressFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    revalidatePath("/settings");

    return {
      status: "success",
      message: "Residential address successfully saved",
    };
  } catch (error: any) {
    return {
      status: "error",
      message: "Failed to save residential address",
    };
  }
};

export const saveMailingAddress = async (
  data: EditMailingAddressFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editMailingAddressFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    revalidatePath("/settings");

    return {
      status: "success",
      message: "Mailing address successfully saved",
    };
  } catch (error: any) {
    return {
      status: "error",
      message: "Failed to save mailing address",
    };
  }
};

export const saveEmergencyContact = async (
  data: EditEmergencyFormSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireUser();

  try {
    const validation = editEmergencyFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data type" };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    revalidatePath("/settings");

    return {
      status: "success",
      message: "Emergency contact successfully saved",
    };
  } catch (error: any) {
    return {
      status: "error",
      message: "Failed to save emergency contact",
    };
  }
};
